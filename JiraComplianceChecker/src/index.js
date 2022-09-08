import Resolver from '@forge/resolver';
import api, {route} from '@forge/api';

const resolver = new Resolver();
const requiredSummary = 50;
const requiredDescription = 4;


resolver.define('getText', async (req) => {
  console.log(req);
  console.log(`Issue key ${req.context.extension.issue.key}`)
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${req.context.extension.issue.key}`);
  const data = await response.json();
  var summaryScore = data.fields.summary.length/requiredSummary;
  if (summaryScore > 1) {
    summaryScore = 1;
  }
  
  var descriptionScore = data.fields.description.content.length/requiredDescription;
  if (descriptionScore > 1) {
    descriptionScore = 1;
  }

  return ((summaryScore+descriptionScore)/2)*100;
});

export const handler = resolver.getDefinitions();
