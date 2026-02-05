import Store from '../models/Store.js';

/**
 * STORE MANAGEMENT CONTROLLER
 *
 * Handles all store management operations:
 * - Get all stores for a user
 * - Get single store
 * - Create new store
 * - Update store
 * - Delete/deactivate store
 */

/**
 * @desc    Get all stores created by the logged-in user
 * @route   GET /api/stores
 * @access  Private (Owner only)
 */
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({
      createdBy: req.user._id,
      isActive: true,
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stores',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single store by ID
 * @route   GET /api/stores/:id
 * @access  Private (Owner only)
 */
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Check if store was created by the logged-in user
    if (store.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this store',
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching store',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new store
 * @route   POST /api/stores
 * @access  Private (Owner only)
 */
export const createStore = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, taxRate, currency, description, openingHours } = req.body;

    // Validate required fields
    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide store name and phone number',
      });
    }

    // Check store limit based on subscription plan
    // For MVP, we'll allow unlimited stores
    // In production, implement subscription-based limits:
    // - Starter/Basic: 1 store
    // - Pro: 3 stores
    // - Enterprise: 7 stores
    const existingStores = await Store.countDocuments({
      createdBy: req.user._id,
      isActive: true,
    });

    // TODO: Implement subscription check
    // const userPlan = req.user.subscriptionPlan || 'starter';
    // const storeLimit = { starter: 1, basic: 1, pro: 3, enterprise: 7 };
    // if (existingStores >= storeLimit[userPlan]) {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Your ${userPlan} plan allows only ${storeLimit[userPlan]} store(s). Upgrade to add more.`
    //   });
    // }

    // Create new store
    const newStore = new Store({
      name,
      email,
      phoneNumber,
      address,
      taxRate,
      currency,
      description,
      openingHours,
      createdBy: req.user._id,
    });

    await newStore.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: newStore,
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating store',
      error: error.message,
    });
  }
};

/**
 * @desc    Update store
 * @route   PUT /api/stores/:id
 * @access  Private (Owner only)
 */
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, address, taxRate, currency, description, openingHours, logo } = req.body;

    // Find store
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Check if store was created by the logged-in user
    if (store.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update stores you created',
      });
    }

    // Update fields
    if (name) store.name = name;
    if (email) store.email = email;
    if (phoneNumber) store.phoneNumber = phoneNumber;
    if (address) store.address = address;
    if (taxRate !== undefined) store.taxRate = taxRate;
    if (currency) store.currency = currency;
    if (description) store.description = description;
    if (openingHours) store.openingHours = openingHours;
    if (logo) store.logo = logo;

    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: store,
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating store',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete/Deactivate store
 * @route   DELETE /api/stores/:id
 * @access  Private (Owner only)
 */
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Check if store was created by the logged-in user
    if (store.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete stores you created',
      });
    }

    // Soft delete - just deactivate the store
    store.isActive = false;
    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store deactivated successfully',
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting store',
      error: error.message,
    });
  }
};

/**
 * @desc    Create multiple stores in bulk
 * @route   POST /api/stores/bulk
 * @access  Private (Owner only)
 */
export const bulkCreateStores = async (req, res) => {
  try {
    const { stores } = req.body;

    // Validate input
    if (!stores || !Array.isArray(stores) || stores.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of stores',
      });
    }

    // Limit bulk operations to prevent abuse
    if (stores.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 50 stores can be created at once',
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // Process each store
    for (let i = 0; i < stores.length; i++) {
      const storeData = stores[i];

      try {
        // Validate required fields
        if (!storeData.name || !storeData.phoneNumber) {
          results.failed.push({
            row: i + 1,
            data: storeData,
            error: 'Store name and phone number are required',
          });
          continue;
        }

        // Create store
        const newStore = new Store({
          name: storeData.name,
          email: storeData.email,
          phoneNumber: storeData.phoneNumber,
          description: storeData.description,
          taxRate: storeData.taxRate || 0,
          currency: storeData.currency || 'NGN',
          address: {
            street: storeData.street || '',
            city: storeData.city || '',
            state: storeData.state || '',
            country: storeData.country || 'Nigeria',
            postalCode: storeData.postalCode || '',
          },
          createdBy: req.user._id,
        });

        await newStore.save();
        results.successful.push({
          row: i + 1,
          store: newStore,
        });
      } catch (error) {
        results.failed.push({
          row: i + 1,
          data: storeData,
          error: error.message,
        });
      }
    }

    const statusCode = results.failed.length === 0 ? 201 : 207; // 207 Multi-Status

    res.status(statusCode).json({
      success: true,
      message: `Created ${results.successful.length} store(s). ${results.failed.length} failed.`,
      data: {
        successful: results.successful,
        failed: results.failed,
        summary: {
          total: stores.length,
          successful: results.successful.length,
          failed: results.failed.length,
        },
      },
    });
  } catch (error) {
    console.error('Bulk create stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating stores in bulk',
      error: error.message,
    });
  }
};
