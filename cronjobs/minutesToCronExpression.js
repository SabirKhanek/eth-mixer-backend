function minutesToCronExpression(minutes) {
  if (minutes <= 0) {
    throw new Error('Invalid number of minutes. It must be greater than 0.');
  }

  let cronExpression;

  if (minutes <= 59) {
    // If the input is less than or equal to 59 minutes, use a standard minute-based cron expression
    cronExpression = `*/${minutes} * * * *`;
  } else {
    // If the input is greater than 59 minutes, convert it to hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      // If there are no remaining minutes, use only the hour field
      cronExpression = `0 */${hours} * * *`;
    } else {
      // Use both hour and minute fields
      cronExpression = `${remainingMinutes} */${hours} * * *`;
    }
  }

  return cronExpression;
}
exports.minutesToCronExpression = minutesToCronExpression;
