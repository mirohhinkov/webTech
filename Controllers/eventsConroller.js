exports.showEvents = (req, res) => {
  const { year, years, data } = req;
  res.status(200).render("years", { year, years, data });
};
