import { supabase } from "../supabase/supabaseClient";

export const CustomerAPI = {
  // Get all customers (user_profiles + customers table)
  async getCustomers() {
    try {
      // Get user profiles (existing users)
      const { data: userProfiles, error: userError } = await supabase
        .from("user_profiles")
        .select("id, name, email, phone, created_at")
        .order("created_at", { ascending: false });

      if (userError) throw userError;

      // Get customers created by admin
      const { data: customers, error: customerError } = await supabase
        .from("customers")
        .select("id, name, email, phone, created_at")
        .order("created_at", { ascending: false });

      if (customerError) throw customerError;

      // Combine and format the data
      const allCustomers = [
        ...(userProfiles || []).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          memberSince: new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          visits: 0, // Set to 0 as requested
          lastVisit: "Never",
          status: "New", // Set to "New" as requested
          source: "user_profile"
        })),
        ...(customers || []).map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          memberSince: new Date(customer.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          visits: 0, // Set to 0 as requested
          lastVisit: "Never",
          status: "New", // Set to "New" as requested
          source: "customer"
        }))
      ];

      return allCustomers;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },

  // Create a new customer
  async createCustomer(customerData) {
    try {
      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone
        })
        .select()
        .single();

      if (error) throw error;
      return newCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },

  // Update customer information
  async updateCustomer(customerId, updateData) {
    try {
      const { data: updatedCustomer, error } = await supabase
        .from("customers")
        .update(updateData)
        .eq("id", customerId)
        .select()
        .single();

      if (error) throw error;
      return updatedCustomer;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  },

  // Delete a customer
  async deleteCustomer(customerId) {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  },

  // Get customer by ID
  async getCustomerById(customerId) {
    try {
      const { data: customer, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return customer;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      throw error;
    }
  }
};
