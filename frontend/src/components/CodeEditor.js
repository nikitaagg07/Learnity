import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Box, 
  Typography, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  Toolbar,
  AppBar,
  Tooltip,
  Grid,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate } from 'react-router-dom';

const CodeEditorApp = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [darkMode, setDarkMode] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  // Initialize code with default for selected language
  useEffect(() => {
    setCode(getDefaultCodeForLanguage(language));
  }, [language]);

  // Handle editor mount
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Configure editor options if needed
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on'
    });
  }

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  };

  // Get Monaco language ID
  const getMonacoLanguage = (lang) => {
    const langMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp',
      'cpp': 'cpp',
      'html': 'html',
      'css': 'css',
      'typescript': 'typescript',
      'sql': 'sql',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'markdown': 'markdown'
    };
    return langMap[lang] || lang;
  };

  // Handle code execution
  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput(`[Execution started at ${new Date().toLocaleTimeString()}]\n\nRunning ${getLanguageLabel(language)} code...\n`);
    
    try {
      // In a real app, you'd call your backend API here
      const response = await executeCode(code, language);
      setOutput(prev => prev + `\n${response.output}\n\n[Execution completed]`);
    } catch (error) {
      setOutput(prev => prev + `\n\nError executing code: ${error.message}\n\n[Execution failed]`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Simulate code execution (would be replaced with real API call)
  const executeCode = async (code, language) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you'd call your real backend API
    // For now, we'll simulate different outputs based on language and code content
    
    try {
      // Simple code parsing to provide dynamic output based on code content
      let output = '';
      
      if (language === 'javascript' || language === 'typescript') {
        // Simulate JS output by checking for console.log statements
        const logMatches = code.match(/console\.log\((.*?)\)/g) || [];
        if (logMatches.length > 0) {
          output = logMatches.map(match => {
            const content = match.substring(12, match.length - 1);
            return evalSafe(content, language);
          }).join('\n');
        } else {
          output = "Code executed successfully (no console output)";
        }
      } else if (language === 'python') {
        // Simulate Python output by checking for print statements
        const printMatches = code.match(/print\((.*?)\)/g) || [];
        if (printMatches.length > 0) {
          output = printMatches.map(match => {
            const content = match.substring(6, match.length - 1);
            return evalSafe(content, language);
          }).join('\n');
        } else {
          output = "Code executed successfully (no print output)";
        }
      } else {
        // Generic simulation for other languages
        output = `Simulated ${getLanguageLabel(language)} output:\nCode executed successfully!\n\nNote: This is a simulated response. In a production environment, code would be executed on a secure backend.`;
      }
      
      return { output };
    } catch (error) {
      throw new Error(`Execution error: ${error.message}`);
    }
  };

  // Safe evaluation for simulated output (never use eval in production!)
  const evalSafe = (content, language) => {
    try {
      // This is just for simulation - in a real app, code execution would happen on the backend
      if (content.includes('"') || content.includes("'")) {
        // If it contains quotes, assume it's a string
        return content.replace(/["']/g, '');
      } else if (!isNaN(Number(content))) {
        // If it's a number
        return content;
      } else if (content.includes('+')) {
        // Simple addition simulation
        const parts = content.split('+').map(p => p.trim());
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          return String(Number(parts[0]) + Number(parts[1]));
        }
      }
      return content;
    } catch {
      return "Error evaluating expression";
    }
  };

  // Format code
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      showSnackbar('Code formatted', 'success');
    }
  };

  // Handle code copy
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorRef.current ? editorRef.current.getValue() : code);
    showSnackbar('Code copied to clipboard', 'success');
  };

  // Handle code reset
  const handleResetCode = () => {
    setCode(getDefaultCodeForLanguage(language));
    showSnackbar('Code reset to default example', 'info');
  };

  // Handle code download
  const handleDownloadCode = () => {
    const fileExtension = getFileExtensionForLanguage(language);
    const codeToDownload = editorRef.current ? editorRef.current.getValue() : code;
    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippet.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Code downloaded successfully', 'success');
  };

  // Handle save code (simulated)
  const handleSaveCode = () => {
    // In a real application, this would save to database or cloud storage
    const codeToSave = editorRef.current ? editorRef.current.getValue() : code;
    localStorage.setItem(`savedCode_${language}`, codeToSave);
    showSnackbar('Code saved successfully', 'success');
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Go back to developer tools
  const handleBack = () => {
    navigate('/land');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      bgcolor: darkMode ? 'grey.900' : 'grey.100'
    }}>
      {/* App Bar */}
      <AppBar 
        position="static" 
        color="primary" 
        elevation={4}
        sx={{ 
          bgcolor: darkMode ? '#1e1e1e' : '#2196f3',
          display: isFullscreen ? 'none' : 'block'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <CodeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
             Code Editor
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ 
            minWidth: 150, 
            mr: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1
          }}>
            <InputLabel id="language-select-label" sx={{ color: 'white' }}>Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              label="Language"
              onChange={handleLanguageChange}
              sx={{ color: 'white' }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="typescript">TypeScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="csharp">C#</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="css">CSS</MenuItem>
              <MenuItem value="sql">SQL</MenuItem>
              <MenuItem value="php">PHP</MenuItem>
              <MenuItem value="ruby">Ruby</MenuItem>
              <MenuItem value="go">Go</MenuItem>
              <MenuItem value="rust">Rust</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Format code">
            <IconButton color="inherit" onClick={handleFormatCode}>
              <FormatLineSpacingIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle fullscreen">
            <IconButton color="inherit" onClick={toggleFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        p: isFullscreen ? 0 : 2,
        backgroundColor: darkMode ? 'grey.900' : 'grey.100',
        overflow: 'hidden'
      }}>
        <Grid container spacing={isFullscreen ? 0 : 2} sx={{ height: '100%' }}>
          {/* Code Editor Panel */}
          <Grid item xs={12} md={isFullscreen ? 12 : 8} sx={{ height: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: isFullscreen ? 0 : 2
              }}
            >
              {/* Editor toolbar */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: darkMode ? '#1e1e1e' : '#e3f2fd', 
                color: darkMode ? 'white' : 'text.primary', 
                p: 1,
                borderTopLeftRadius: isFullscreen ? 0 : 8,
                borderTopRightRadius: isFullscreen ? 0 : 8
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', ml: 1 }}>
                  {getLanguageLabel(language)} Editor
                </Typography>
                <Box>
                  <Tooltip title="Reset to default">
                    <IconButton size="small" color="inherit" onClick={handleResetCode}>
                      <RestartAltIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Format code">
                    <IconButton size="small" color="inherit" onClick={handleFormatCode}>
                      <FormatLineSpacingIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy code">
                    <IconButton size="small" color="inherit" onClick={handleCopyCode}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download code">
                    <IconButton size="small" color="inherit" onClick={handleDownloadCode}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save code">
                    <IconButton size="small" color="inherit" onClick={handleSaveCode}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  {isFullscreen && (
                    <Tooltip title="Exit fullscreen">
                      <IconButton size="small" color="inherit" onClick={toggleFullscreen}>
                        <FullscreenExitIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Button 
                    variant="contained" 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: darkMode ? 'success.dark' : 'success.main', 
                      '&:hover': { bgcolor: darkMode ? 'success.main' : 'success.dark' } 
                    }}
                    startIcon={isExecuting ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? 'Running...' : 'Run'}
                  </Button>
                </Box>
              </Box>
              
              {/* Monaco Editor */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Editor
                  height="100%"
                  language={getMonacoLanguage(language)}
                  value={code}
                  theme={darkMode ? 'vs-dark' : 'light'}
                  onChange={(value) => setCode(value)}
                  onMount={handleEditorDidMount}
                  options={{
                    readOnly: false,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: fontSize,
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    automaticLayout: true,
                    tabSize: 2,
                    formatOnPaste: true,
                    formatOnType: true,
                    renderLineHighlight: 'all',
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    lineNumbersMinChars: 3,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: true,
                    bracketPairColorization: { enabled: true },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Output/Console Panel - Hidden in fullscreen mode */}
          {!isFullscreen && (
            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                <Box sx={{ 
                  bgcolor: darkMode ? '#1e1e1e' : '#e3f2fd', 
                  color: darkMode ? 'white' : 'text.primary', 
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', ml: 1 }}>
                    Console Output
                  </Typography>
                  <Box>
                    <Tooltip title="Clear console">
                      <IconButton size="small" color="inherit" onClick={() => setOutput('')}>
                        <RestartAltIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy output">
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={() => {
                          navigator.clipboard.writeText(output);
                          showSnackbar('Output copied to clipboard', 'success');
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    flex: 1, 
                    p: 2, 
                    bgcolor: darkMode ? '#000' : '#fff', 
                    color: darkMode ? '#4ec9b0' : '#0f4b33',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8
                  }}
                >
                  {output || 'Run your code to see output here...'}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Helper function to get language label
function getLanguageLabel(language) {
  const langLabels = {
    'javascript': 'JavaScript',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'cpp': 'C++',
    'html': 'HTML',
    'css': 'CSS',
    'typescript': 'TypeScript',
    'sql': 'SQL',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'markdown': 'Markdown'
  };
  return langLabels[language] || language.charAt(0).toUpperCase() + language.slice(1);
}

// Helper function to get file extension for selected language
function getFileExtensionForLanguage(language) {
  const extensionMap = {
    'javascript': 'js',
    'python': 'py',
    'java': 'java',
    'csharp': 'cs',
    'cpp': 'cpp',
    'html': 'html',
    'css': 'css',
    'typescript': 'ts',
    'sql': 'sql',
    'php': 'php',
    'ruby': 'rb',
    'go': 'go',
    'rust': 'rs',
    'swift': 'swift',
    'kotlin': 'kt',
    'markdown': 'md'
  };
  return extensionMap[language] || 'txt';
}

// Helper function to get default code for selected language
function getDefaultCodeForLanguage(language) {
  switch (language) {
    case 'javascript':
      return `// JavaScript Example
function helloWorld() {
  console.log("Hello, World!");
  
  // Calculate some values
  const sum = (a, b) => a + b;
  const result = sum(10, 5);
  
  console.log(\`The sum is: \${result}\`);
  
  // Return a value
  return result;
}

// Call the function
const output = helloWorld();
console.log("Function returned:", output);`;
    case 'python':
      return `# Python Example
def hello_world():
    print("Hello, World!")
    
    # Calculate some values
    def sum(a, b):
        return a + b
    
    result = sum(10, 5)
    print(f"The sum is: {result}")
    
    # Return a value
    return result

# Call the function
output = hello_world()
print("Function returned:", output)`;
    case 'java':
      return `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Calculate some values
        int result = sum(10, 5);
        System.out.println("The sum is: " + result);
    }
    
    public static int sum(int a, int b) {
        return a + b;
    }
}`;
    case 'csharp':
      return `// C# Example
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        // Calculate some values
        int result = Sum(10, 5);
        Console.WriteLine($"The sum is: {result}");
    }
    
    static int Sum(int a, int b) {
        return a + b;
    }
}`;
    case 'cpp':
      return `// C++ Example
#include <iostream>

int sum(int a, int b) {
    return a + b;
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Calculate some values
    int result = sum(10, 5);
    std::cout << "The sum is: " << result << std::endl;
    
    return 0;
}`;
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>This is a simple HTML example page.</p>
    </div>
    
    <script>
        console.log("JavaScript is running!");
    </script>
</body>
</html>`;
    case 'css':
      return `/* CSS Example */
/* Global styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f8f9fa;
    color: #333;
}

/* Container styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header styles */
header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: center;
}

/* Button styles */
.button {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #2980b9;
}`;
    case 'typescript':
      return `// TypeScript Example
interface Person {
    name: string;
    age: number;
}

function greet(person: Person): string {
    return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

// Create a person object
const user: Person = {
    name: "John Doe",
    age: 30
};

// Use the greet function
const message: string = greet(user);
console.log(message);

// Calculate some values with type safety
function sum(a: number, b: number): number {
    return a + b;
}

const result: number = sum(10, 5);
console.log(\`The sum is: \${result}\`);`;
    case 'sql':
      return `-- SQL Example
-- Create a table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10, 2)
);

-- Insert some data
INSERT INTO employees 
    (employee_id, first_name, last_name, email, hire_date, salary)
VALUES
    (1, 'John', 'Doe', 'john.doe@example.com', '2022-01-15', 65000.00),
    (2, 'Jane', 'Smith', 'jane.smith@example.com', '2022-02-20', 72000.00),
    (3, 'Bob', 'Johnson', 'bob.johnson@example.com', '2022-03-10', 58000.00);

-- Query the data
SELECT 
    employee_id,
    first_name || ' ' || last_name AS full_name,
    salary
FROM 
    employees
WHERE 
    salary > 60000
ORDER BY 
    salary DESC;`;
    case 'php':
      return `<?php
// PHP Example
function helloWorld() {
    echo "Hello, World!\\n";
    
    // Calculate some values
    function sum($a, $b) {
        return $a + $b;
    }
    
    $result = sum(10, 5);
    echo "The sum is: " . $result . "\\n";
    
    return $result;
}

// Call the function
$output = helloWorld();
echo "Function returned: " . $output . "\\n";
?>`;
    case 'ruby':
      return `# Ruby Example
def hello_world
  puts "Hello, World!"
  
  # Calculate some values
  def sum(a, b)
    return a + b
  end
  
  result = sum(10, 5)
  puts "The sum is: #{result}"
  
  return result
end

# Call the function
output = hello_world
puts "Function returned: #{output}"`;
    case 'go':
      return `// Go Example
package main

import "fmt"

func sum(a, b int) int {
    return a + b
}

func main() {
    fmt.Println("Hello, World!")
    
    // Calculate some values
    result := sum(10, 5)
    fmt.Println("The sum is:", result)
}`;
    case 'rust':
      return `// Rust Example
fn main() {
    println!("Hello, World!");
    
    // Calculate some values
    let result = sum(10, 5);
    println!("The sum is: {}", result);
}

fn sum(a: i32, b: i32) -> i32 {
    a + b
}`;
case 'markdown':
      return `# Hello World in Markdown

This is a simple markdown document.

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- Lists (like this one!)

## Code Example

\`\`\`javascript
function helloWorld() {
  console.log("Hello from Markdown!");
}
\`\`\`

## Table Example

| Name  | Age | Occupation |
|-------|-----|------------|
| John  | 30  | Developer  |
| Sarah | 28  | Designer   |

> This is a blockquote. Markdown is a lightweight markup language.

![Image Description](https://via.placeholder.com/150)

`;
    default:
      return `// ${getLanguageLabel(language)} Example

// Write your code here
console.log("Hello, World!");
`;
  }
}

export default CodeEditorApp;