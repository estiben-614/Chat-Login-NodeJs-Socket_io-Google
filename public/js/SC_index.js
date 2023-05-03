const socket = io({
    extraHeaders: {
      "my-custom-header": "12345"
    }
  });