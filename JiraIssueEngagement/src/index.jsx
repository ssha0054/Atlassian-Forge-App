import ForgeUI, { Table, Head, Row, Cell, ProjectPage, render, Fragment, Text, IssuePanel, useProductContext, useState } from '@forge/ui';
import api, { route } from '@forge/api';

const fetchNumberOfComments = async function(issueKey) {
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/comment`);
  const data = await response.json();
  return data.total;
}

const fetchIssuesWithNumberOfComments = async function(projectKey) {
  const jql = `project in (${projectKey})`;
  const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}`);
  const data = await response.json();

  let issueWithNumberOfComments = [];
  for (const issue of data.issues) {
    const numberOfComments = await fetchNumberOfComments(issue.key);
    issueWithNumberOfComments.push({
      "key": issue.key, 
      "summary": issue.fields.summary, 
      "numComments": numberOfComments});
  }
  return issueWithNumberOfComments;
}

const updateEngagementScore = async function(issueId, score) {
  const fieldKey = "5c501b60-ad5d-4a5e-9387-b24042cc35ef__DEVELOPMENT__engagement-score-field";
  const body = {updates: [
    {
      issueIds: [issueId],
      value: score
    }
  ]};
  const response = await api.asApp().requestJira(route`/rest/api/3/app/field/${fieldKey}/value`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  console.log(`Reponses ${response.status} ${response.statusText}`);
}


const EngagementPanel = () => {
  const {platformContext: {issueKey}} = useProductContext();
  const [numComments] = useState(fetchNumberOfComments(issueKey));
  return (
    <Fragment>
      <Text>Engagement score: {numComments}</Text>
    </Fragment>
  );
};

export const panel = render(
  <IssuePanel>
    <EngagementPanel />
  </IssuePanel>
);

export const EngagementOverview = () => {
  const {platformContext: {projectKey}} = useProductContext();
  const [issues] = useState(fetchIssuesWithNumberOfComments(projectKey));
  console.log(JSON.stringify(issues));
  return (
    <Table>
      <Head>
        <Cell><Text>Issue Key</Text></Cell>
        <Cell><Text>Summary</Text></Cell>
        <Cell><Text>Engagement Score</Text></Cell>
      </Head>
      {issues.map(issues => (
        <Row>
          <Cell><Text>{issues.key}</Text></Cell>
          <Cell><Text>{issues.summary}</Text></Cell>
          <Cell><Text>{issues.numComments}</Text></Cell>
        </Row>
      ))}
      
    </Table>
  )
}

export const engagementOverview = render(
  <ProjectPage>
    <EngagementOverview/>
  </ProjectPage>
)

export async function trigger(event, context) {
  console.log("Trigger fired");
  console.log(JSON.stringify(event));
  const numComments = await fetchNumberOfComments(event.issue.key);
  await updateEngagementScore(event.issue.id, numComments);
  console.log("Trigger finished");
}

export async function scheduledTrigger(event) {
  console.log("Scheduled trigger fired");
  const response = await api.asApp().requestJira(route`/rest/api/3/search?maxResults=100`);
  const data = await response.json();
  for (const issue of data.issues) {
    let comments = await fetchNumberOfComments(issues.key);
    await updateEngagementScore(issue.id, comments);
  }
}