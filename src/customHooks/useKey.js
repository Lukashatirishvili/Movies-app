import { useEffect } from "react";

export default function useKey(event, key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener(event, callback);

    return () => {
      document.removeEventListener(event, callback);
    };
  }, [event, key, action]);
}
