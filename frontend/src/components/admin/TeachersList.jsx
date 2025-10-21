import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import apiBase from '../../config/api';

const TeachersList = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [filters, setFilters] = useState({
        status: 'all',
        class: 'all'
    });

    // Memoize the fetch function
    const fetchTeachers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiBase}/teachers`, {
                withCredentials: true
            });
            setTeachers(response.data);
            setError(null);
            enqueueSnackbar('Teachers list updated successfully', { variant: 'success' });
        } catch (err) {
            setError('Failed to fetch teachers data');
            enqueueSnackbar('Error loading teachers list', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    // Initial fetch
    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Handle sorting
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle search
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle filters
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(0);
    };

    // Memoized filtered and sorted data
    const filteredAndSortedData = useMemo(() => {
        return teachers
            .filter(teacher => {
                const matchesSearch = Object.values(teacher)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                
                const matchesStatus = filters.status === 'all' || teacher.status === filters.status;
                const matchesClass = filters.class === 'all' || teacher.class_name === filters.class;
                
                return matchesSearch && matchesStatus && matchesClass;
            })
            .sort((a, b) => {
                const isAsc = order === 'asc';
                if (orderBy === 'name') {
                    return isAsc 
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                }
                return isAsc
                    ? a[orderBy] < b[orderBy] ? -1 : 1
                    : b[orderBy] < a[orderBy] ? -1 : 1;
            });
    }, [teachers, searchQuery, filters, orderBy, order]);

    // Pagination
    const paginatedData = filteredAndSortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (error) {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="300px"
            >
                <Typography color="error" gutterBottom>{error}</Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchTeachers}
                    variant="contained"
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Search and Filter Bar */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton onClick={fetchTeachers} disabled={loading}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <TableContainer 
                component={Paper} 
                sx={{ 
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                            <TableCell sx={{ color: 'white' }}>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                    sx={{ color: 'white' }}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white' }}>Class</TableCell>
                            <TableCell sx={{ color: 'white' }}>Section</TableCell>
                            <TableCell sx={{ color: 'white' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No teachers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((teacher) => (
                                <TableRow 
                                    key={teacher.id}
                                    sx={{ 
                                        '&:hover': { 
                                            backgroundColor: theme.palette.action.hover 
                                        }
                                    }}
                                >
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>{teacher.class_name || 'Not Assigned'}</TableCell>
                                    <TableCell>{teacher.section_name || 'Not Assigned'}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                backgroundColor: teacher.status === 'active' 
                                                    ? theme.palette.success.light 
                                                    : theme.palette.error.light,
                                                color: teacher.status === 'active' 
                                                    ? theme.palette.success.dark 
                                                    : theme.palette.error.dark,
                                                py: 0.5,
                                                px: 1.5,
                                                borderRadius: 1,
                                                display: 'inline-block',
                                                textTransform: 'capitalize',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {teacher.status}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAndSortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default TeachersList;