require("datejs");

const getNextUse = (lastUsedDate, days) => {
  // Last used date
  const last_used_on = new Date(lastUsedDate.split("T")[0]);

  // Next use date
  const next_use_on = last_used_on.add(days).day().getTime();

  // Current date
  const c_time = new Date().getTime();

  // Days remaining
  const days_rem = (next_use_on - c_time) / (60 * 60 * 24 * 1000);

  return days_rem;
};

module.exports = { getNextUse };
