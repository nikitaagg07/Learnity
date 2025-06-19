import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Add as AddIcon
} from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { useNavigate } from 'react-router-dom';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tester-tabpanel-${index}`}
      aria-labelledby={`api-tester-tab-${index}`}
      {...other}
      style={{ padding: '20px 0' }}
    >
      {value === index && children}
    </div>
  );
}

const ApiTester = () => {
  const navigate = useNavigate();
  
  // States
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [requestBody, setRequestBody] = useState('{}');
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [savedRequests, setSavedRequests] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [requestName, setRequestName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [requestStartTime, setRequestStartTime] = useState(null);
  
  // Load saved requests and history from local storage
  useEffect(() => {
    const savedRequestsFromStorage = localStorage.getItem('apiTesterSavedRequests');
    const historyFromStorage = localStorage.getItem('apiTesterHistory');
    
    if (savedRequestsFromStorage) {
      setSavedRequests(JSON.parse(savedRequestsFromStorage));
    }
    
    if (historyFromStorage) {
      setRequestHistory(JSON.parse(historyFromStorage));
    }
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/land');
  };
  
  // Handle param change
  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };
  
  // Add new param row
  const addParamRow = () => {
    setParams([...params, { key: '', value: '' }]);
  };
  
  // Remove param row
  const removeParamRow = (index) => {
    const newParams = [...params];
    newParams.splice(index, 1);
    setParams(newParams);
  };
  
  // Build URL with params
  const buildUrlWithParams = () => {
    let finalUrl = url;
    const queryParams = params
      .filter(param => param.key && param.value)
      .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
      .join('&');
    
    if (queryParams) {
      finalUrl += (url.includes('?') ? '&' : '?') + queryParams;
    }
    
    return finalUrl;
  };
  
  // Send request
  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    setResponseTime(null);
    
    const finalUrl = buildUrlWithParams();
    let parsedHeaders = {};
    
    try {
      parsedHeaders = JSON.parse(headers);
    } catch (err) {
      setError('Invalid JSON in headers');
      setLoading(false);
      return;
    }
    
    let requestOptions = {
      method,
      headers: parsedHeaders
    };
    
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const bodyObj = JSON.parse(requestBody);
        requestOptions.body = JSON.stringify(bodyObj);
      } catch (err) {
        setError('Invalid JSON in request body');
        setLoading(false);
        return;
      }
    }
    
    // Record the time the request starts
    const startTime = new Date().getTime();
    setRequestStartTime(startTime);
    
    try {
      const res = await fetch(finalUrl, requestOptions);
      
      // Calculate the response time
      const endTime = new Date().getTime();
      const timeTaken = endTime - startTime;
      setResponseTime(timeTaken);
      
      // Get status code
      setStatusCode(res.status);
      
      // Try to parse as JSON first
      let responseData;
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json();
        setResponse(JSON.stringify(responseData, null, 2));
      } else {
        responseData = await res.text();
        setResponse(responseData);
      }
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        method,
        url: finalUrl,
        headers: parsedHeaders,
        body: method !== 'GET' && method !== 'HEAD' ? requestBody : null,
        status: res.status,
        responseTime: timeTaken,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [historyItem, ...requestHistory].slice(0, 20); // Keep only the last 20 items
      setRequestHistory(updatedHistory);
      localStorage.setItem('apiTesterHistory', JSON.stringify(updatedHistory));
      
    } catch (err) {
      setError(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Save request
  const saveRequest = () => {
    if (!requestName.trim()) {
      setError('Please provide a name for this request');
      return;
    }
    
    const newSavedRequest = {
      id: Date.now(),
      name: requestName,
      method,
      url,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? requestBody : null,
      params: params.filter(param => param.key || param.value)
    };
    
    const updatedSavedRequests = [...savedRequests, newSavedRequest];
    setSavedRequests(updatedSavedRequests);
    localStorage.setItem('apiTesterSavedRequests', JSON.stringify(updatedSavedRequests));
    
    setRequestName('');
    setSaveDialogOpen(false);
    setShowSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };
  
  // Load saved request
  const loadSavedRequest = (request) => {
    setMethod(request.method);
    setUrl(request.url);
    setHeaders(request.headers);
    
    if (request.body) {
      setRequestBody(request.body);
    } else {
      setRequestBody('{}');
    }
    
    if (request.params && request.params.length > 0) {
      setParams(request.params);
    } else {
      setParams([{ key: '', value: '' }]);
    }
    
    setTabValue(0); // Switch to Request tab
  };
  
  // Delete saved request
  const deleteSavedRequest = (id) => {
    const updatedSavedRequests = savedRequests.filter(req => req.id !== id);
    setSavedRequests(updatedSavedRequests);
    localStorage.setItem('apiTesterSavedRequests', JSON.stringify(updatedSavedRequests));
  };
  
  // Copy response to clipboard
  const copyResponseToClipboard = () => {
    navigator.clipboard.writeText(response);
    // Show temporary message
    const tempMessage = document.createElement('div');
    tempMessage.innerText = 'Copied to clipboard!';
    tempMessage.style = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 10px; border-radius: 4px; z-index: 9999;';
    document.body.appendChild(tempMessage);
    
    setTimeout(() => {
      document.body.removeChild(tempMessage);
    }, 2000);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          API Tester
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
          <FormControl sx={{ width: 120, mr: 2 }}>
            <InputLabel id="method-select-label">Method</InputLabel>
            <Select
              labelId="method-select-label"
              value={method}
              label="Method"
              onChange={(e) => setMethod(e.target.value)}
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="HEAD">HEAD</MenuItem>
              <MenuItem value="OPTIONS">OPTIONS</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            sx={{ mr: 2 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={sendRequest}
            disabled={loading || !url}
            sx={{ height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
          
          <IconButton 
            color="primary" 
            onClick={() => setSaveDialogOpen(true)}
            title="Save Request"
            sx={{ ml: 1, height: 56 }}
          >
            <SaveIcon />
          </IconButton>
          
          <IconButton 
            color="primary" 
            onClick={() => setHistoryDialogOpen(true)}
            title="Request History"
            sx={{ ml: 1, height: 56 }}
          >
            <HistoryIcon />
          </IconButton>
        </Box>
        
        {showSaveSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>Request saved successfully!</Alert>
        )}
        
        {saveDialogOpen && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Save Request</Typography>
            <TextField
              label="Request Name"
              variant="outlined"
              fullWidth
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="text" 
                onClick={() => setSaveDialogOpen(false)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={saveRequest}
              >
                Save
              </Button>
            </Box>
          </Paper>
        )}
        
        {historyDialogOpen && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Request History</Typography>
              <Button 
                variant="text" 
                onClick={() => setHistoryDialogOpen(false)}
              >
                Close
              </Button>
            </Box>
            
            {requestHistory.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No request history yet</Typography>
            ) : (
              requestHistory.map(item => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    p: 1, 
                    mb: 1, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => {
                    setMethod(item.method);
                    setUrl(item.url);
                    if (item.headers) {
                      setHeaders(JSON.stringify(item.headers, null, 2));
                    }
                    if (item.body) {
                      setRequestBody(item.body);
                    }
                    setHistoryDialogOpen(false);
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={item.method} 
                        size="small" 
                        color={
                          item.method === 'GET' ? 'info' :
                          item.method === 'POST' ? 'success' :
                          item.method === 'PUT' ? 'warning' :
                          item.method === 'DELETE' ? 'error' : 'default'
                        }
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {item.url}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={`${item.status}`} 
                      size="small"
                      color={
                        item.status >= 200 && item.status < 300 ? 'success' :
                        item.status >= 400 ? 'error' : 'warning'
                      }
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {item.responseTime}ms
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        )}
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="API tester tabs">
              <Tab label="Request" id="api-tester-tab-0" />
              <Tab label="Response" id="api-tester-tab-1" />
              <Tab label="Saved Requests" id="api-tester-tab-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Request Parameters
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              {params.map((param, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    mb: index === params.length - 1 ? 0 : 2,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    label="Key"
                    variant="outlined"
                    size="small"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    variant="outlined"
                    size="small"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                  />
                  <IconButton 
                    onClick={() => removeParamRow(index)}
                    color="error"
                    disabled={params.length === 1 && index === 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={addParamRow}
                sx={{ mt: 2 }}
              >
                Add Parameter
              </Button>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Headers
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <CodeMirror
                value={headers}
                height="150px"
                extensions={[json()]}
                onChange={(value) => setHeaders(value)}
                theme="light"
              />
            </Paper>
            
            {method !== 'GET' && method !== 'HEAD' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Request Body
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <CodeMirror
                    value={requestBody}
                    height="200px"
                    extensions={[json()]}
                    onChange={(value) => setRequestBody(value)}
                    theme="light"
                  />
                </Paper>
              </>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            
            {(statusCode || responseTime) && (
              <Box sx={{ display: 'flex', mb: 2 }}>
                {statusCode && (
                  <Chip 
                    label={`Status: ${statusCode}`} 
                    color={
                      statusCode >= 200 && statusCode < 300 ? 'success' :
                      statusCode >= 400 ? 'error' : 'warning'
                    }
                    sx={{ mr: 2 }}
                  />
                )}
                
                {responseTime && (
                  <Chip 
                    label={`Time: ${responseTime}ms`} 
                    color="primary" 
                  />
                )}
              </Box>
            )}
            
            {response ? (
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <IconButton 
                  sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                  onClick={copyResponseToClipboard}
                  title="Copy to clipboard"
                >
                  <CopyIcon />
                </IconButton>
                <CodeMirror
                  value={response}
                  height="400px"
                  extensions={[json()]}
                  editable={false}
                  theme="light"
                />
              </Paper>
            ) : (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '400px',
                  bgcolor: '#f9f9f9'
                }}
              >
                {loading ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="textSecondary">Sending request...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <ApiIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                      No response yet. Send a request to see results here.
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {savedRequests.length === 0 ? (
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  border: '1px dashed #ccc',
                  borderRadius: 1
                }}
              >
                <SaveIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  No saved requests yet. Use the save button to store your API requests.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {savedRequests.map((req) => (
                  <Grid item xs={12} md={6} key={req.id}>
                    <Paper 
                      elevation={2}
                      sx={{ 
                        p: 2, 
                        position: 'relative',
                        '&:hover': { boxShadow: 3 }
                      }}
                    >
                      <Typography variant="h6" noWrap sx={{ mb: 1, pr: 6 }}>
                        {req.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={req.method} 
                          size="small"
                          color={
                            req.method === 'GET' ? 'info' :
                            req.method === 'POST' ? 'success' :
                            req.method === 'PUT' ? 'warning' :
                            req.method === 'DELETE' ? 'error' : 'default'
                          }
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {req.url}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedRequest(req.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => loadSavedRequest(req)}
                        sx={{ mt: 1 }}
                      >
                        Load Request
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiTester;