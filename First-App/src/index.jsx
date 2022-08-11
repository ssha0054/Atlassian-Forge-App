import ForgeUI, { IssueActivity, ModalDialog, IssueAction, IssueGlance, IssuePanel, render, ProjectPage, Fragment, Text, useState, useProductContext } from '@forge/ui';
import api, { route } from '@forge/api';

const fetchNumberOfIssues = async () => {
    const responses = await api.asApp().requestJira(route`/rest/api/3/search`);
    const data = await responses.json();
    return data.total;
}

const App = () => {
    const [numIssues] = useState(async () => await fetchNumberOfIssues());
    return (
        <Fragment>
            <Text>Number of issues: {numIssues}</Text>
        </Fragment>
    );
};

export const run = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);

const Panel = () => {
    const {platformContext: {issueKey}} = useProductContext();
    return(
        <Fragment>
            <Text>Something about this issue: {issueKey}</Text>
        </Fragment>
    )
}

export const panel = render(
    <IssuePanel>
        <Panel />
    </IssuePanel>
)

export const glance = render(
    <IssueGlance>
        <Fragment>
            <Text>Information about this issue</Text>
        </Fragment>
    </IssueGlance>
)

const Action = () => {
    const [isVisible, setVisible] = useState(true);
    if (isVisible) {
        return (
            <ModalDialog closeButtonText="Do It!" header="My Action" onClose={() => setVisible(false)}>
                <Text>We will now perform an action</Text>
            </ModalDialog>
        )
    } else {
        console.log("Performing the action")
        return null;
    }
}

export const action = render(
    <IssueAction>
        <Action/>
    </IssueAction>
)

export const activity = render(
    <IssueActivity>
        <Fragment>
            <Text>Here is some text</Text>
        </Fragment>
    </IssueActivity>
)

export const validate = async ({issue}) => {
    console.log("Validator invoked");
    console.log(JSON.stringify(issue));
    const {key: issuekey} = issue;
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issuekey}`);
    const data = await response.json()
    const summary = data.fields.summary;

    return {
        result: summary.includes("please"),
        errorMessage: "You must use the magic word"
    }
}