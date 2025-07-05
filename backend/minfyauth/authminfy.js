const authminfy = async (req, res, next) => {
  try {
    const minfyEmails = [
  "example@test.com",
  "shybash.shaik@minfytech.com",
  "voma.sreeja@minfytech.com",
  "venkata.kowshik@minfytech.com",
  "javvadi.tanmaie@minfytech.com",
  "avanish.kumar@minfytech.com",
  "amaan.ahmed@minfytech.com",
  "mahak.yadav@minfytech.com",
  "shivam.pandey@gmail.com",
  "boddupally.rohan@minfytech.com",
  "akankssha.adepu@minfytech.com",
  "rakesh.ravi@minfytech.com",
  "keerthi.kelam@minfytech.com",
  "siva.nithin@minfytech.com",
  "akash.kumar@minfytech.com",
  "uzaif.ali@minfytech.com",
  "Livanshu.saini@minfytech.com",
  "himaghna.das@minfytech.com",
  "Charishma.gajula@minfytech.com",
  "om.raj@minfytech.com",
  "midhilesh.polisetty@minfytech.com",
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
