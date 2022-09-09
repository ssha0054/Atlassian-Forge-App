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
                <svg width="100%" height="50px">
                  <g class="bars">
                    <rect fill="#3d5599" width="100%" height="25"></rect>
                    <rect fill="#cd4d3e" width={issue.score} height="25"></rect>
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