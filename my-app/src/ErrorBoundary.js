import React from 'react'
import Im from './components/image/404.png'
import { Image} from 'antd';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
 
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }
 
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like AppSignal
    // logErrorToMyService(error, errorInfo);
  }
 
  render() {
    const { hasError, error } = this.state;
 
    if (hasError) {
      return (
      <div>
          <Image width={100} height={500} src={Im}></Image>
          <h1>Oops, page not found</h1>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
          Try again?
          </button>
      </div>
      );
    }
    return this.props.children;
  }
}
 
const ErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong ????</p>
 
    {error.message && <span>Here's the error: {error.message}</span>}
  </div>
);
 
const ErrorBoundary = (WrappedComponent) => {
  return class extends ErrorBoundary {
    render() {
      const { hasError, error } = this.state;
 
      if (hasError) {
        // You can render any custom fallback UI
        return <ErrorFallback error={error} />;
      }
 
      return <WrappedComponent {...this.props} />;
    }
  };
};
 
export { ErrorBoundary }