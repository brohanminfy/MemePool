const authminfy = async (req, res, next) => {
  try {
    const minfyEmails = [
      "boddupally.rohan@minfytech.com",
      "midhilesh.polisetty@minfytech.com",
      "voma.sreeja@minfytech.com",
      "rakesh.ravi@minfytech.com",
      "example@minfytech.com",
      "New@gamil.com"
    ];

    const { email } = req.body;

    const isVerified = minfyEmails.some(
      (e) => e.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (isVerified) {
      console.log("Verified");
      return next(); // Allow request to proceed
    }

    return res.status(400).json({ success: false, error: "User not verified" });

  } catch (e) {
    console.error("authminfy error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export default authminfy;
