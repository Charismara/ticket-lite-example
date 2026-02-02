import djs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Create instance
const dayjs = djs;
// Extend with plugins
dayjs.extend(isBetween);
// Export the configured instance
export { dayjs };
