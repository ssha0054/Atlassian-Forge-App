import ForgeUI, { IssueGlance, IssuePanel, render, ProjectPage, Fragment, Text, useState, useProductContext } from '@forge/ui';
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