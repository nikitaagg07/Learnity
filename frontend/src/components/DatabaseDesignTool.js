import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// For a real application, you'd likely want to use a library for diagram rendering
// like react-diagrams, react-flow, or mermaid.js

const DatabaseDesigner = () => {
  const navigate = useNavigate();
  
  const [tables, setTables] = useState([
    {
      id: 1,
      name: 'users',
      columns: [
        { id: 1, name: 'id', type: 'INTEGER', primaryKey: true, notNull: true, autoIncrement: true },
        { id: 2, name: 'username', type: 'VARCHAR(255)', primaryKey: false, notNull: true, unique: true },
        { id: 3, name: 'email', type: 'VARCHAR(255)', primaryKey: false, notNull: true, unique: true },
        { id: 4, name: 'password', type: 'VARCHAR(255)', primaryKey: false, notNull: true },
        { id: 5, name: 'created_at', type: 'TIMESTAMP', primaryKey: false, notNull: true, defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    },
    {
      id: 2,
      name: 'posts',
      columns: [
        { id: 1, name: 'id', type: 'INTEGER', primaryKey: true, notNull: true, autoIncrement: true },
        { id: 2, name: 'user_id', type: 'INTEGER', primaryKey: false, notNull: true, foreignKey: { table: 'users', column: 'id' } },
        { id: 3, name: 'title', type: 'VARCHAR(255)', primaryKey: false, notNull: true },
        { id: 4, name: 'content', type: 'TEXT', primaryKey: false, notNull: true },
        { id: 5, name: 'created_at', type: 'TIMESTAMP', primaryKey: false, notNull: true, defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    }
  ]);
  
  const [selectedTable, setSelectedTable] = useState(null);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [newTable, setNewTable] = useState({ name: '' });
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'VARCHAR(255)',
    primaryKey: false,
    notNull: false,
    unique: false,
    autoIncrement: false,
    defaultValue: '',
    foreignKey: null
  });
  const [editingColumn, setEditingColumn] = useState(null);
  
  // Go back to developer tools
  const handleBack = () => {
    navigate('/land');
  };
  
  // Handle table selection
  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
  };
  
  // Add new table dialog
  const handleOpenTableDialog = () => {
    setNewTable({ name: '' });
    setOpenTableDialog(true);
  };
  
  const handleCloseTableDialog = () => {
    setOpenTableDialog(false);
  };
  
  const handleAddTable = () => {
    if (!newTable.name) return;
    
    const newTableObj = {
      id: tables.length + 1,
      name: newTable.name,
      columns: []
    };
    
    setTables([...tables, newTableObj]);
    setSelectedTable(newTableObj.id);
    setOpenTableDialog(false);
  };
  
  // Add/edit column dialog
  const handleOpenColumnDialog = (column = null) => {
    if (column) {
      setEditingColumn(column.id);
      setNewColumn({ ...column });
    } else {
      setEditingColumn(null);
      setNewColumn({
        name: '',
        type: 'VARCHAR(255)',
        primaryKey: false,
        notNull: false,
        unique: false,
        autoIncrement: false,
        defaultValue: '',
        foreignKey: null
      });
    }
    setOpenColumnDialog(true);
  };
  
  const handleCloseColumnDialog = () => {
    setOpenColumnDialog(false);
  };
  
  const handleAddColumn = () => {
    if (!newColumn.name) return;
    
    const updatedTables = tables.map(table => {
      if (table.id === selectedTable) {
        if (editingColumn) {
          // Edit existing column
          const updatedColumns = table.columns.map(col => 
            col.id === editingColumn ? { ...newColumn } : col
          );
          return { ...table, columns: updatedColumns };
        } else {
          // Add new column
          const newColumnObj = {
            ...newColumn,
            id: table.columns.length + 1
          };
          return { ...table, columns: [...table.columns, newColumnObj] };
        }
      }
      return table;
    });
    
    setTables(updatedTables);
    setOpenColumnDialog(false);
  };
  
  // Delete column
  const handleDeleteColumn = (columnId) => {
    const updatedTables = tables.map(table => {
      if (table.id === selectedTable) {
        const updatedColumns = table.columns.filter(col => col.id !== columnId);
        return { ...table, columns: updatedColumns };
      }
      return table;
    });
    
    setTables(updatedTables);
  };
  
  // Delete table
  const handleDeleteTable = (tableId) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    setTables(updatedTables);
    if (selectedTable === tableId) {
      setSelectedTable(updatedTables.length > 0 ? updatedTables[0].id : null);
    }
  };
  
  // Generate SQL
  const generateSQL = () => {
    let sql = '';
    
    tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`;
      
      // Add columns
      const columnDefinitions = table.columns.map(col => {
        let definition = `  ${col.name} ${col.type}`;
        
        if (col.primaryKey) definition += ' PRIMARY KEY';
        if (col.notNull) definition += ' NOT NULL';
        if (col.unique) definition += ' UNIQUE';
        if (col.autoIncrement) definition += ' AUTO_INCREMENT';
        if (col.defaultValue) definition += ` DEFAULT ${col.defaultValue}`;
        
        return definition;
      });
      
      sql += columnDefinitions.join(',\n');
      
      // Add foreign keys
      const foreignKeys = table.columns
        .filter(col => col.foreignKey)
        .map(col => {
          return `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreignKey.table}(${col.foreignKey.column})`;
        });
      
      if (foreignKeys.length > 0) {
        sql += ',\n' + foreignKeys.join(',\n');
      }
      
      sql += '\n);\n\n';
    });
    
    return sql;
  };
  
  // Download SQL
  const handleDownloadSQL = () => {
    const sql = generateSQL();
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get current table object
  const currentTable = tables.find(table => table.id === selectedTable);
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Database Designer
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)', gap: 2 }}>
        {/* Table List Panel */}
        <Paper sx={{ p: 2, width: 250, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Tables</Typography>
            <Button 
              size="small" 
              startIcon={<AddIcon />} 
              variant="outlined"
              onClick={handleOpenTableDialog}
            >
              New
            </Button>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {tables.map(table => (
              <Box 
                key={table.id}
                sx={{ 
                  p: 1, 
                  borderRadius: 1,
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: selectedTable === table.id ? 'primary.light' : 'background.paper',
                  color: selectedTable === table.id ? 'primary.contrastText' : 'inherit',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: selectedTable === table.id ? 'primary.light' : 'action.hover'
                  }
                }}
                onClick={() => handleSelectTable(table.id)}
              >
                <Typography>{table.name}</Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: selectedTable === table.id ? 'inherit' : 'error.main' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(table.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            sx={{ mt: 2 }}
            onClick={handleDownloadSQL}
          >
            Export SQL
          </Button>
        </Paper>
        
        {/* Table Details Panel */}
        <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentTable ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Table: <strong>{currentTable.name}</strong>
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AddIcon />} 
                  variant="contained"
                  onClick={() => handleOpenColumnDialog()}
                >
                  Add Column
                </Button>
              </Box>
              
              <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Attributes</TableCell>
                      <TableCell>Foreign Key</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentTable.columns.map(column => (
                      <TableRow key={column.id}>
                        <TableCell>{column.name}</TableCell>
                        <TableCell>{column.type}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {column.primaryKey && <Chip label="PK" size="small" color="primary" />}
                            {column.notNull && <Chip label="NOT NULL" size="small" />}
                            {column.unique && <Chip label="UNIQUE" size="small" />}
                            {column.autoIncrement && <Chip label="AUTO INC" size="small" />}
                            {column.defaultValue && <Chip label={`DEFAULT: ${column.defaultValue}`} size="small" />}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {column.foreignKey && (
                            <Chip 
                              label={`${column.foreignKey.table}.${column.foreignKey.column}`} 
                              size="small" 
                              color="secondary" 
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenColumnDialog(column)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteColumn(column.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                Select a table or create a new one
              </Typography>
            </Box>
          )}
        </Paper>
        
        {/* Diagram View Panel */}
        <Paper sx={{ p: 2, width: 350, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Relationships</Typography>
          
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tables.map(table => {
              const foreignKeys = table.columns.filter(col => col.foreignKey);
              
              return foreignKeys.length > 0 && (
                <Box 
                  key={table.id}
                  sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>{table.name}</Typography>
                  
                  {foreignKeys.map(col => {
                    const targetTable = tables.find(t => t.name === col.foreignKey.table);
                    
                    return (
                      <Box 
                        key={col.id}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'action.hover'
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{col.name}</strong> →
                        </Typography>
                        <Chip 
                          label={`${col.foreignKey.table}.${col.foreignKey.column}`}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Preview SQL</Typography>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.900',
                color: 'grey.100',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <pre style={{ margin: 0 }}>{generateSQL()}</pre>
            </Paper>
          </Box>
        </Paper>
      </Box>
      
      {/* Add Table Dialog */}
      <Dialog open={openTableDialog} onClose={handleCloseTableDialog}>
        <DialogTitle>Add New Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Table Name"
            fullWidth
            value={newTable.name}
            onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTableDialog}>Cancel</Button>
          <Button onClick={handleAddTable} color="primary" variant="contained">
            Add Table
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Column Dialog */}
      <Dialog 
        open={openColumnDialog} 
        onClose={handleCloseColumnDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingColumn ? 'Edit Column' : 'Add New Column'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              label="Column Name"
              fullWidth
              value={newColumn.name}
              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={newColumn.type}
                label="Data Type"
                onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
              >
                <MenuItem value="INTEGER">INTEGER</MenuItem>
                <MenuItem value="BIGINT">BIGINT</MenuItem>
                <MenuItem value="DECIMAL(10,2)">DECIMAL(10,2)</MenuItem>
                <MenuItem value="VARCHAR(255)">VARCHAR(255)</MenuItem>
                <MenuItem value="TEXT">TEXT</MenuItem>
                <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                <MenuItem value="DATE">DATE</MenuItem>
                <MenuItem value="TIMESTAMP">TIMESTAMP</MenuItem>
                <MenuItem value="JSON">JSON</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newColumn.primaryKey}
                    onChange={(e) => setNewColumn({ ...newColumn, primaryKey: e.target.checked })}
                  />
                }
                label="Primary Key"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newColumn.notNull}
                    onChange={(e) => setNewColumn({ ...newColumn, notNull: e.target.checked })}
                  />
                }
                label="Not Null"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newColumn.unique}
                    onChange={(e) => setNewColumn({ ...newColumn, unique: e.target.checked })}
                  />
                }
                label="Unique"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newColumn.autoIncrement}
                    onChange={(e) => setNewColumn({ ...newColumn, autoIncrement: e.target.checked })}
                  />
                }
                label="Auto Increment"
              />
            </Box>
            
            <TextField
              label="Default Value"
              fullWidth
              value={newColumn.defaultValue || ''}
              onChange={(e) => setNewColumn({ ...newColumn, defaultValue: e.target.value })}
              placeholder="e.g. CURRENT_TIMESTAMP"
            />
            
            <Divider />
            
            <Typography variant="subtitle1">Foreign Key (Optional)</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Reference Table</InputLabel>
                <Select
                  value={newColumn.foreignKey?.table || ''}
                  label="Reference Table"
                  onChange={(e) => {
                    const selectedTable = e.target.value;
                    if (selectedTable) {
                      const targetTable = tables.find(t => t.name === selectedTable);
                      const primaryKey = targetTable?.columns.find(col => col.primaryKey);
                      
                      setNewColumn({
                        ...newColumn,
                        foreignKey: {
                          table: selectedTable,
                          column: primaryKey?.name || ''
                        }
                      });
                    } else {
                      setNewColumn({
                        ...newColumn,
                        foreignKey: null
                      });
                    }
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {tables
                    .filter(table => currentTable && table.id !== currentTable.id)
                    .map(table => (
                      <MenuItem key={table.id} value={table.name}>
                        {table.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              {newColumn.foreignKey?.table && (
                <FormControl fullWidth>
                  <InputLabel>Reference Column</InputLabel>
                  <Select
                    value={newColumn.foreignKey?.column || ''}
                    label="Reference Column"
                    onChange={(e) => {
                      setNewColumn({
                        ...newColumn,
                        foreignKey: {
                          ...newColumn.foreignKey,
                          column: e.target.value
                        }
                      });
                    }}
                  >
                    {tables
                      .find(t => t.name === newColumn.foreignKey.table)
                      ?.columns.map(col => (
                        <MenuItem key={col.id} value={col.name}>
                          {col.name} {col.primaryKey ? '(PK)' : ''}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColumnDialog}>Cancel</Button>
          <Button onClick={handleAddColumn} color="primary" variant="contained">
            {editingColumn ? 'Update Column' : 'Add Column'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DatabaseDesigner;