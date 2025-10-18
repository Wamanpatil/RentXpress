import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ✅ Reference to the User who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // ✅ Reference to the rented Item (equipment/vehicle/room)
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"],
    },

    // ✅ Start and end date of the booking
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // ✅ Total cost of the booking
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    // ✅ Booking status (for future use in admin panel)
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// ✅ Index for faster lookup (important for Admin Dashboard queries)
bookingSchema.index({ user: 1 });
bookingSchema.index({ item: 1 });
bookingSchema.index({ status: 1 });

// ✅ Virtual populate (so you can easily get user/item details with one query)
bookingSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

bookingSchema.virtual("itemDetails", {
  ref: "Item",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});

// ✅ Convert virtuals to JSON output
bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

// ✅ Export the Booking model
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
