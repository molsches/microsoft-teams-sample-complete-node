import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";

export class O365ConnectorCardActionsDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
       // let choice = session.gettext(Strings.choice);

        // multiple choice examples
        let cardAction1 = new teams.O365ConnectorCardActionCard(session)
                            .id("cardAction-1")
                            .name("Order an X-ray")
                            .inputs([
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-1")
                                    .title("Select a study type")
                                    .isMultiSelect(false)
                                    .isRequired(true)
                                    .style("expanded")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Hand XR").value("HandXR"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Chest XR").value("ChestXR"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Head CT").value("HeadCT"),
                                    ]),
                                    new teams.O365ConnectorCardTextInput(session)
                                    .id("list-2")
                                    .title("Instructions")
                                    .isMultiline(true),
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-3")
                                    .title("Time")
                                    .isMultiSelect(false)
                                    .style("expanded")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Now").value("a"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tomorrow").value("b"),
                                    ]),
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-4")
                                    .title("Location")
                                    .isMultiSelect(false)
                                    .style("expanded")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Best match").value("x"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Health System ASC").value("y"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Hospital Radiology").value("z"),
                                    ]),
                            ])
                            .actions([
                                new teams.O365ConnectorCardHttpPOST(session)
                                    .id("cardAction-1-btn-1")
                                    .name(Strings.send)
                                    .body(JSON.stringify({
                                        event: "order",
                                        list1: "{{list-1.value}}",
                                        list2: "{{list-2.value}}",
                                        list3: "{{list-3.value}}",
                                        list4: "{{list-4.value}}",
                                    })).toAction(),
                            ]);

        // text input examples
        let cardAction2 = new teams.O365ConnectorCardActionCard(session)
                            .id("cardAction-2")
                            .name("Get Patient Summary")
                            .actions([
                                new teams.O365ConnectorCardHttpPOST(session)
                                    .id("cardAction-2-btn-1")
                                    .name(Strings.send)
                                    .body(JSON.stringify({
                                        event: "summary",
                                    })),
                            ]);

        // date / time input examples
        let cardAction3 = new teams.O365ConnectorCardActionCard(session)
                            .id("cardAction-3")
                            .name("Message the PCP")
                            .inputs([
                                new teams.O365ConnectorCardTextInput(session)
                                    .id("message")
                                    .title("Message for PCP")
                                    .isMultiline(true),
                            ])
                            .actions([
                                new teams.O365ConnectorCardHttpPOST(session)
                                    .id("cardAction-3-btn-1")
                                    .name(Strings.send)
                                    .body(JSON.stringify({
                                        event: "task",
                                        message: "{{message.value}}",
                                    })),
                            ]);

        let section = new teams.O365ConnectorCardSection(session)
                        .markdown(true);

        let card = new teams.O365ConnectorCard(session)
                        .summary("Patient Record for: " + session.userData.currentPatient)
                        .themeColor("#000000")
                        .title("Patient Record for: " + session.userData.currentPatient)
                        .text("Take an action")
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
            DialogIds.O365ConnectorCardActionsDialogId,
            DialogMatches.O365ConnectorCardActionsDialogMatch,
            O365ConnectorCardActionsDialog.step1,
        );
    }
}
