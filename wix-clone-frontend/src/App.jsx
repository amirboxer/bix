// cmp
import { BringThemHome } from './cmps/BringThemHome';

// pages
import Editor from './pages/Editor';

// store
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      {/* <BringThemHome /> */}
      <Editor />
    </Provider>
  )
}

export default App;