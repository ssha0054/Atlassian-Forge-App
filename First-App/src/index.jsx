import ForgeUI, { render, ProjectPage, Fragment, Text, useState } from '@forge/ui';
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
