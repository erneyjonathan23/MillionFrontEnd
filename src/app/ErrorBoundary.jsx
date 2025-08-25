import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(error, info){ console.error('App error:', error, info); }
  render(){
    if(this.state.hasError){
      return (
        <main style={{ padding: 32 }}>
          <h1>Algo salió mal</h1>
          <p>Intenta recargar o vuelve más tarde.</p>
        </main>
      );
    }
    return this.props.children;
  }
}
