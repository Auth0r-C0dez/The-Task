import "dotenv/config";
import { clearAll } from "../store";
import { loadDemoBundle, runDemoDating } from "../demo/demoService";

async function main() {
  clearAll();
  const loaded = await loadDemoBundle();
  console.log(loaded);
  const dating = await runDemoDating();
  console.log(dating);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
