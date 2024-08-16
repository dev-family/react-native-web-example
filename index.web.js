import { AppRegistry } from "react-native";
import name from "./app.json";
import App from "./src/App";
import { enableExperimentalWebImplementation } from "react-native-gesture-handler";

enableExperimentalWebImplementation(true);

AppRegistry.registerComponent(name, () => {
  // --> here - assign telegram config
  return App;
});

AppRegistry.runApplication(name, {
  initialProps: {},
  rootTag: document.getElementById("app-root"),
});
