import { app } from "./app";
import { SETTINGS } from "./settings";

//console.log(process.env.PORT)

app.listen(SETTINGS.PORT, ()=> {
    console.log("Server running")
})