import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
let config = require("config");
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as https from "https";


export class QuizQ1Dialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let buttons = new Array<builder.CardAction>();

        let options = {
            hostname: "fhir.catalyzeapps.com",
            port: 443,
            path: "/schedule",
            method: "POST",
        };
var schedule = [];
var namesArray = ["None"];
        const req = https.request(options, (res) => {
            console.log("STATUS: " + res.statusCode);
            if (res.statusCode === 200) {
            }
            else {
                // Figuring out some error handling system for these items
                // Will be critical in production.
                // If this failed, you could just dump the unprocessed message in a database
                // And have this application run some retry logic until it succeeded
                // This is crucial if the bot can do critical functionality - Like Orders
            }   
            res.on('data', (d) => {
                var content = "" + d;
                schedule = JSON.parse(content);
                console.log("schedule length " + schedule.length )
                console.log("getscheduleinfoLength" + schedule[0].getscheduleinfo)
                console.log("iterating");
                for (let entry of schedule[0].getscheduleinfo) {
                    var name = entry.Patient
                    var info = name + " " + entry.TimeStart
                    namesArray.push(name);
                    buttons.push(builder.CardAction.imBack(session, info, session.gettext(info)));
                }
        
                // buttons.push(builder.CardAction.imBack(session, "Steve Johnson, DOB: 07/07/1950, Male", session.gettext("Steve Johnson, DOB: 07/07/1950, Male")));
                // buttons.push(builder.CardAction.imBack(session, "Stella Johns, DOB: 05/20/1966, Female", session.gettext("Stella Johns, DOB: 05/20/1966, Female")));
                // buttons.push(builder.CardAction.imBack(session, "Stephen John-Sullivan, DOB: 9/20/1980, Male", session.gettext("Stephen John-Sullivan, DOB: 9/20/1980, Male")));
                // buttons.push(builder.CardAction.imBack(session, "None of these", session.gettext("None of these")));
                let newCard = new builder.HeroCard(session)
                    .title(session.gettext("Here's your schedule"))
                    .text("Pick a patient to get more information on them.")
                    .buttons(buttons);
        
                let msg = new builder.Message(session)
                    .addAttachment(newCard);
                console.log("made it to builder.Prompts");
                builder.Prompts.choice(session, msg, namesArray);
              });
            
        });
        // write data to request body
        req.write("TEAMS");
        req.end();
        


    
    }

    private static async getPatient(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.userData.currentPatient = args.response.entity;
        session.send("Hold on, let me get that patient for you");
        session.send("@Datica_Health_Bot patient context card")
    
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.QuizQ1DialogId,
            DialogMatches.QuizQ1DialogMatch,
            [
                QuizQ1Dialog.step1,
                QuizQ1Dialog.getPatient,
            ],
        );
    }
}
