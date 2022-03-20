import React from 'react'
import PureComponentDemo from './PureComponentDemo'
import ShouldComponentUpdateDemo from './ShouldComponentUpdateDemo'
import MemoDemo from './MemoDemo'

class App extends React.Component {
  
  render() {
    return <div>
      <PureComponentDemo />
      <ShouldComponentUpdateDemo />
      <MemoDemo />
    </div>
  }
}

export default App;
