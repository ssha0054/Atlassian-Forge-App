import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  var issueScoreText = data + "%";
  return (
    <div>
      {data ? data : 'Loading...'}
      <svg width="100%" height="50px">
        <g class="bars">
          <rect fill="#ff0000" width="100%" height="25"></rect>
          <rect fill="#00ff00" width={issueScoreText} height="25"></rect>
        </g>
      </svg>
    </div>
  );
}

export default App;
