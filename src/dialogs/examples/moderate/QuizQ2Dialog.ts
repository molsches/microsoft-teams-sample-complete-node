import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
let config = require("config");
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as https from "https";

export class QuizQ2Dialog extends TriggerActionDialog {

    private static async getInput(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
    
        builder.Prompts.text(session, "Enter the MRN or demographic information for the patient (first name, last name, etc.)");
    
    }

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let buttons = new Array<builder.CardAction>();

        let options = {
            hostname: "fhir.catalyzeapps.com",
            port: 443,
            path: "/empi",
            method: "POST",
        };
var patients = [];
var namesArray = ["None"];
console.log(args.response.entity);
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
                patients = JSON.parse(content);
                console.log("patients length " + patients.length )
                console.log("searchpatientsinfoLength" + patients[0].searchpatientsinfo)
                console.log("iterating");
                for (let entry of patients[0].searchpatientsinfo) {
                    var name = entry.firstname + " " + entry.lastname 
                    var info = name + " " + " DOB: " + entry.dateofbirth + ", " + entry.gender;
                    namesArray.push(name);
                    buttons.push(builder.CardAction.imBack(session, info, session.gettext(info)));
                }
        
                // buttons.push(builder.CardAction.imBack(session, "Steve Johnson, DOB: 07/07/1950, Male", session.gettext("Steve Johnson, DOB: 07/07/1950, Male")));
                // buttons.push(builder.CardAction.imBack(session, "Stella Johns, DOB: 05/20/1966, Female", session.gettext("Stella Johns, DOB: 05/20/1966, Female")));
                // buttons.push(builder.CardAction.imBack(session, "Stephen John-Sullivan, DOB: 9/20/1980, Male", session.gettext("Stephen John-Sullivan, DOB: 9/20/1980, Male")));
                // buttons.push(builder.CardAction.imBack(session, "None of these", session.gettext("None of these")));
                let newCard = new builder.HeroCard(session)
                    .title(session.gettext("I found multiple results"))
                    .text("Pick the correct patient")
                    .buttons(buttons);
        
                let msg = new builder.Message(session)
                    .addAttachment(newCard);
                console.log("made it to builder.Prompts");
                builder.Prompts.choice(session, msg, namesArray);
              });
            
        });
        // write data to request body
        req.write(args.response);
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
            DialogIds.QuizQ2DialogId,
            DialogMatches.QuizQ2DialogMatch,
            [
                QuizQ2Dialog.getInput,
                QuizQ2Dialog.step1,
                QuizQ2Dialog.getPatient,
            ],
        );
    }
}
