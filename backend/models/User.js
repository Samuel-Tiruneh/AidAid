// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Username is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//     },
//     role: {
//       type: String,
//       enum: ['Donor', 'Requester', 'Admin'],
//       default: 'Donor',
//       required: true
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     phoneNumber: {
//       type: String,
//       default: "", 
//     },
//     location: {
//       type: String,
//       default: "",
//     },
//     profilePicture: {
//       type: String, 
//       default: ""
//     },
//   },
//   { timestamps: true }
// );

// // Keep the existing password hashing middleware
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     console.log("Password not modified, skipping hashing");
//     return next();
//   }
//   console.log("Password modified, hashing...");
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Keep the existing password comparison method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   console.log("Comparing passwords...");
//   console.log("Stored Hashed Password:", this.password);
//   console.log("Entered Password:", enteredPassword);
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Add a pre-save hook to sync isAdmin with role if needed
// userSchema.pre("save", function(next) {
//   if (this.isModified('role')) {
//     this.isAdmin = this.role === 'Admin';
//   }
//   next();
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ['Donor', 'Requester', 'Admin'],
      default: 'Donor',
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      default: "", 
    },
    location: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String, 
      default: ""
    },
     status: {
      type: String,
      enum: ['active', 'ban'],
      default: 'active'
    },
  },
  { timestamps: true }
);

// Keep the existing password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hashing");
    return next();
  }
  console.log("Password modified, hashing...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Keep the existing password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Comparing passwords...");
  console.log("Stored Hashed Password:", this.password);
  console.log("Entered Password:", enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add a pre-save hook to sync isAdmin with role if needed
userSchema.pre("save", function(next) {
  if (this.isModified('role')) {
    this.isAdmin = this.role === 'Admin';
  }
  next();
});

module.exports = mongoose.model("User", userSchema);