
    (function () {
      window.addEventListener('error', function (e) {
        const errInfo = 'Error: ' + e.message + ' at ' + e.filename + ':' + e.lineno;
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: errInfo, stack: e.error ? e.error.stack : null })
        }).catch(() => { });
      });
      window.addEventListener('unhandledrejection', function (e) {
        const errInfo = 'Unhandled Rejection: ' + (e.reason ? e.reason.message || e.reason.stack || e.reason : e);
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: errInfo, stack: e.reason && e.reason.stack ? e.reason.stack : null })
        }).catch(() => { });
      });
    })();
  