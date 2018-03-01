import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";

export class O365ConnectorCardDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // let choice = session.gettext(Strings.choice);
 
         // multiple choice examples
         let cardAction1 = new teams.O365ConnectorCardActionCard(session)
                             .id("cardAction-1")
                             .name("See current patient census")
                             ;
 
         // text input examples
         let cardAction2 = new teams.O365ConnectorCardActionCard(session)
                             .id("cardAction-2")
                             .name("Infectious Disease");
                           
 
         // date / time input examples
         let cardAction3 = new teams.O365ConnectorCardActionCard(session)
                             .id("cardAction-3")
                             .name("Today's surgery stats");
 
         let section = new teams.O365ConnectorCardSection(session)
                         .markdown(true);
 
         let card = new teams.O365ConnectorCard(session)
                         .summary("Analytics Dashboard")
                         .themeColor("#000000")
                         .title("Analytics Dashboard")
                         .text("Which report would you like to see")
                         .sections([section])
                         .potentialAction([
                             cardAction1,
                             cardAction2,
                             cardAction3,
                         ]);
 
         let msg = new teams.TeamsMessage(session)
                     .summary(Strings.message_summary)
                     .attachments([card]);
 
         session.send(msg);
         session.endDialog();
     }
 
     constructor(
         bot: builder.UniversalBot,
     ) {
         super(bot,
             DialogIds.O365ConnectorCardDialogId,
             DialogMatches.O365ConnectorCardDialogMatch,
             O365ConnectorCardDialog.step1,
         );
     }
}
