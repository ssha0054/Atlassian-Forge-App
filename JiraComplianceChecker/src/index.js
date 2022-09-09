import Resolver from '@forge/resolver';
import api, {route} from '@forge/api';

const resolver = new Resolver();
const requiredSummary = 50;
const requiredDescription = 4;

function getScore(data) {
  var summaryScore = (data.fields.summary? data.fields.summary.length/requiredSummary : 0);
  if (summaryScore > 1) {
    summaryScore = 1;
  }
  
  var descriptionScore = (data.fields.description? data.fields.description.content.length/requiredDescription: 0);
  if (descriptionScore > 1) {
    descriptionScore = 1;
  }

  return ((summaryScore+descriptionScore)/2)*100;
}

resolver.define('getText', async (req) => {
  console.log(req);
  console.log(`Issue key ${req.context.extension.issue.key}`)
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${req.context.extension.issue.key}`);
  const data = await response.json();
  return getScore(data);
});

resolver.define('getProjectOverview', async (req) => {
  console.log(req);
  //console.log(`Issue key ${req.context.extension.issue.key}`)
  var jql = `project in (${req.context.extension.project.key})`;
  const response = await api.asApp().requestJira(route`/rest/api/3/search?${jql}&extend=names&fields=summary,description`);
  const data = await response.json();
  var issueScores = [];
  for (var issue of data.issues) {
    console.log(`Issue ${issue.key}`);
    issueScores.push({
      "key": issue.key,
      "score": getScore(issue)
    });
  }
  console.log(issueScores);
  return issueScores;
});

export const handler = resolver.getDefinitions();
