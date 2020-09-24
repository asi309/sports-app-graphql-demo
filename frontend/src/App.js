import React from 'react';
import { Container } from 'reactstrap';

import { ContextWrapper } from './user-context';
import Routes from './routes';
import './App.css';

function App() {
  return (
    <ContextWrapper>
      <Container>
        <h1>Sport Management App</h1>
        <div className="content-box">
          <Routes />
        </div>
      </Container>
    </ContextWrapper>
  );
}

export default App;
