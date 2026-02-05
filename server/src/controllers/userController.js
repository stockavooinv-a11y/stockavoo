import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { userInviteTemplate } from '../utils/emailTemplates.js';

/**
 * USER MANAGEMENT CONTROLLER
 *
 * Handles all user management operations:
 * - Get all users in a business
 * - Get single user
 * - Create/invite new user
 * - Update user (including role changes)
 * - Delete/deactivate user
 * - Get current user profile
 * - Update own profile
 */

/**
 * @desc    Get all users in the same business
 * @route   GET /api/users
 * @access  Private (Owner, Manager)
 */
export const getAllUsers = async (req, res) => {
  try {
    // Only show users created by the logged-in owner
    const users = await User.find({
      isActive: true,
      createdBy: req.user._id
    })
      .select('-password -verificationToken -passwordResetToken')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private (Owner, Manager, or Self)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user was created by the logged-in owner
    if (user.createdBy && user.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this user'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -verificationToken -passwordResetToken');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * @desc    Create/Invite new user
 * @route   POST /api/users
 * @access  Private (Owner only)
 */
export const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, phoneNumber, role'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Create new user without password (they'll set it via token link)
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      phoneNumber,
      role,
      businessId: req.user.businessId, // Associate with owner's business
      createdBy: req.user._id, // Track who created this user
      isVerified: false, // User must verify email and setup password
      isFirstLogin: true, // First time user
      agreedToTerms: true // Assumed since owner is adding them
    });

    // Generate password setup token
    const setupToken = newUser.createPasswordSetupToken();
    await newUser.save({ validateBeforeSave: false });

    // Send account setup email
    const emailContent = userInviteTemplate(fullName, email, setupToken);

    try {
      await sendEmail({
        to: email,
        subject: 'You have been invited to Stockavoo',
        html: emailContent
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the request if email fails
    }

    // Remove sensitive data before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.passwordSetupToken;

    res.status(201).json({
      success: true,
      message: `User invited successfully. Setup email sent to ${email}`,
      data: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Owner, or Self for limited fields)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, role, isActive, profilePicture } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user was created by the logged-in owner
    if (user.createdBy && user.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update users you created'
      });
    }

    // Check permissions
    const isOwner = req.user.role === 'owner';

    // Only owner can change role and isActive status
    if ((role || isActive !== undefined) && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only business owners can change user roles or active status'
      });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePicture) user.profilePicture = profilePicture;

    // Owner-only updates
    if (isOwner) {
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
    }

    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.passwordResetToken;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * @desc    Delete/Deactivate user
 * @route   DELETE /api/users/:id
 * @access  Private (Owner only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent owner from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user was created by the logged-in owner
    if (user.createdBy && user.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete users you created'
      });
    }

    // Soft delete - just deactivate the account
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * @desc    Update own profile
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateOwnProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, profilePicture } = req.body;

    const user = await User.findById(req.user._id);

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.passwordResetToken;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
