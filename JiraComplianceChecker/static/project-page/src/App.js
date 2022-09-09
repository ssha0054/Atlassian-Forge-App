import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getProjectOverview', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <div>
      <table>
        <tr>
          <th>Key</th>
          <th>Score</th>
        </tr>
        {data ? 
          data.map(issue => (
            <tr>
              <td>{issue.key}</td>
              <td>
                <svg width="100px" height="50px">
                  <g class="bars">
                    <rect fill="#ff0000" width="100%" height="10"></rect>
                    <rect fill="#00ff00" width={issue.score} height="10"></rect>
                  </g>
                </svg>
              </td>
            </tr>
          )) 
          : 'Loading...'
        }
      </table>
    </div>
  );
}

export default App;