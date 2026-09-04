// src/bootstrap/react-hooks.js
// Must load first: exposes the React hooks used as bare globals
// (useState, useEffect, useRef) by every other split file.
const { useState, useEffect, useRef } = React;
