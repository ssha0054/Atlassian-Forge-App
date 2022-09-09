import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getProjectOverview', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <div>
      {data ? data[0].key : 'Loading...'}
      
    </div>
  );
}

export default App;
