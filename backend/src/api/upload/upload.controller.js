export const upload = (req, res) => {
  logger.info("Upload Successful", { file: req.file })

  return res.status(200).json({
    message: "Upload Successful",
    data: {
      name: req.file.originalname,
      url: req.file.location,
    },
  })
}
