// Supabase client initialization
(function() {
  var SUPABASE_URL = 'https://mluucibhbiovjkvgfryr.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdXVjaWJoYmlvdmprdmdmcnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTQ5MTMsImV4cCI6MjA4OTA3MDkxM30.Nx6iHJW0_vNOX5XouTaaNQW5x0s1fomFcjkIMrNHU1Y';

  var lib = window.supabase;
  if (lib && typeof lib.createClient === 'function') {
    window.supabaseClient = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.error('Supabase library not found on window.supabase');
    window.supabaseClient = null;
  }
})();

var supabase = window.supabaseClient;
