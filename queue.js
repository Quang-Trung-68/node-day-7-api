require("module-alias/register");
require("dotenv").config();
const tasks = require("@/tasks");
const queueService = require("@/services/queue.service");
const sleep = require("./src/utils/sleep");
const { taskStatus } = require("./src/configs/constants");

(async () => {
  while (true) {
    const firstTask = await queueService.getPendingJob();
    if (firstTask) {
      const { id, type, payload: jsonPayload } = firstTask;
      try {
        console.log(`Task "${type}" is processing...`);
        const payload = JSON.parse(jsonPayload);

        await queueService.updateStatus(id, taskStatus.inprogress);

        const handler = tasks[type];
        if (handler) {
          await handler(payload);
        } else {
          console.log(`Task '${type}' type is not defined.`);
        }

        queueService.updateStatus(id, taskStatus.completed);
        console.log(`Task "${type}" processed.`);
      } catch (error) {
        console.log(`Task "${type}" failed.`);
        queueService.updateStatus(id, taskStatus.failed);
      }
    }
    await sleep(3000);
  }
})();
