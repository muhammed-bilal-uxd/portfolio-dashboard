import * as React from "react";
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

import "./ChartModel.css";
import Modal from "../Modal/Modal";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// mui/material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FilledInput,
  Stack,
  Typography,
  Box
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MappingData from "../MappingData/MappingData";

const menuItems = [
  { label: "Edit Chart Name", key: "name", icon: <EditIcon fontSize="small" /> },
  { label: "Edit Chart Data", key: "data", icon: <StorageIcon fontSize="small" /> },
];

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Modern vibrant color palette
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

export default function ChartModel({ configData, dataIndex }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [configName, setConfigName] = useState("");
  const [showEditChartPopup, setShowEditChartPopup] = useState(false);
  const [localConfigData, setLocalConfigData] = useState(configData);

  // chart edit popup state
  const [selectListItemOne, setSelectListItemOne] = useState("");
  const [selectListItemTwo, setSelectListItemTwo] = useState("");
  const [tableItems, setTableItems] = useState([]);

  useEffect(() => {
    if (localConfigData) {
      setSelectedChart(localConfigData?.data?.chartType || "");
      setConfigName(localConfigData?.configName || "");
      setSelectListItemOne(localConfigData?.data?.selectListItemOne || "");
      setSelectListItemTwo(localConfigData?.data?.selectListItemTwo || "");
      setTableItems(localConfigData?.data?.tableItems || []);
    }
  }, [localConfigData]);

  const chartData = localConfigData?.data?.chartData || [];

  const getChartColor = (index) => COLORS[index % COLORS.length];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'rgba(17, 24, 39, 0.9)', 
          p: 1.5, 
          borderRadius: '12px', 
          border: '1px solid var(--color-outline-variant)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography sx={{ color: 'var(--color-on-surface)', fontWeight: 700, fontSize: '0.75rem', mb: 0.5 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} sx={{ color: entry.color || entry.fill, fontSize: '0.75rem', fontWeight: 600 }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const handleMenuItem = (key) => {
    if (key === "name") {
      setNewConfigName(configName);
      setShowNamePopup(true);
    } else if (key === "data") {
      setShowEditChartPopup(true);
    }
  };

  const handleChangeMappingDetails = async (payload) => {
    try {
      const url = VITE_API_URL + `/project-chart?chartId=${localConfigData?._id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      if (payload?.configName) {
        setConfigName(newConfigName);
      } else {
        setLocalConfigData({
          ...localConfigData,
          data: { ...localConfigData.data, ...payload }
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveChartData = () => {
    setShowEditChartPopup(false);
    const updatedChartData = tableItems.map((i) => ({
      label: localConfigData?.data?.apiAllData[i][selectListItemOne],
      value: localConfigData?.data?.apiAllData[i][selectListItemTwo],
    }));

    handleChangeMappingDetails({
      chartData: updatedChartData,
      selectListItemOne,
      selectListItemTwo,
      tableItems
    });
  };

  const renderActiveChart = (isModal = false) => {
    const commonProps = {
      width: "100%",
      height: isModal ? 400 : 220,
    };

    switch (selectedChart) {
      case "line":
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tertiary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-tertiary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                name={selectListItemTwo}
                stroke="var(--color-tertiary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar 
                dataKey="value" 
                name={selectListItemTwo}
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "doughnut":
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={selectedChart === "doughnut" ? "60%" : 0}
                outerRadius="85%"
                paddingAngle={5}
                dataKey="value"
                nameKey="label"
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColor(index)} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer {...commonProps}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="var(--color-outline-variant)" />
              <PolarAngleAxis dataKey="label" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name={selectListItemTwo}
                dataKey="value"
                stroke="var(--color-tertiary)"
                fill="var(--color-tertiary)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "polar":
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                outerRadius="80%"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="chart-model-container" sx={{ mb: 3 }}>
      <Box className="chart-model-header" sx={{ mb: 2 }}>
        <Typography className="chart-model-title">
          {configName} 
          <Box component="span" sx={{ opacity: 0.5, fontWeight: 500, ml: 1, fontSize: '0.85rem' }}>
            ({selectedChart === "card" ? "card" : `${selectedChart} chart`})
          </Box>
        </Typography>
        
        <PopupState variant="popover">
          {(popupState) => (
            <React.Fragment>
              <IconButton {...bindTrigger(popupState)} size="small">
                <MoreVertIcon sx={{ color: 'var(--color-on-surface-variant)' }} />
              </IconButton>
              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid var(--color-outline-variant)',
                    minWidth: 180,
                    mt: 1,
                    p: 0.5
                  }
                }}
              >
                {menuItems.map((menu, i) => (
                  <MenuItem 
                    key={i} 
                    onClick={() => { popupState.close(); handleMenuItem(menu.key); }}
                    sx={{ borderRadius: '10px', mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ color: 'var(--color-on-surface-variant)', minWidth: '32px !important' }}>{menu.icon}</ListItemIcon>
                    <ListItemText primary={menu.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }} />
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </Box>

      <Box 
        className="chart-card" 
        onClick={() => setModalOpen(true)}
        sx={{
          background: 'var(--color-surface-container)',
          borderRadius: '24px',
          p: 3,
          border: '1px solid var(--color-outline-variant)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'var(--color-tertiary)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
          }
        }}
      >
        {selectedChart === "card" ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: 180 }}>
            <Typography sx={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>
              {chartData[0]?.label}
            </Typography>
            <Typography sx={{ color: 'var(--color-on-surface)', fontSize: '2.5rem', fontWeight: 900 }}>
              {chartData[0]?.value}
            </Typography>
          </Box>
        ) : (
          renderActiveChart()
        )}
      </Box>

      {/* Modal for expanded view */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.25rem', mb: 3, color: 'var(--color-on-surface)' }}>
            {configName} Data View
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            {renderActiveChart(true)}
          </Box>
        </Box>
      </Modal>

      {/* Popups for editing */}
      <Dialog open={showNamePopup} onClose={() => setShowNamePopup(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1, bgcolor: 'var(--color-surface-container-high)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Change Name</DialogTitle>
        <DialogContent>
          <FilledInput
            fullWidth
            autoFocus
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            sx={{ borderRadius: '12px', bgcolor: 'var(--color-surface-container-highest)' }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowNamePopup(false)} sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" className="btn-pill-primary" onClick={() => { setShowNamePopup(false); handleChangeMappingDetails({ configName: newConfigName }); }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        fullWidth maxWidth="md" 
        open={showEditChartPopup} 
        onClose={() => setShowEditChartPopup(false)}
        PaperProps={{ sx: { borderRadius: '24px', p: 1, bgcolor: 'var(--color-surface-container-high)', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Mapping Data</DialogTitle>
        <DialogContent>
          <MappingData
            parent="chart"
            showMappingData={true}
            mapBaseDataKeys={localConfigData?.data?.baseDataKeys}
            mapApiAllData={localConfigData?.data?.apiAllData}
            mapSelectedChart={selectedChart}
            mapSingleData={localConfigData?.data?.singleData}
            mapSelectListItemOne={selectListItemOne}
            mapSelectListItemTwo={selectListItemTwo}
            mapTableItems={tableItems}
            setMapSelectListItemOne={setSelectListItemOne}
            setMapSelectListItemTwo={setSelectListItemTwo}
            setMapTableItems={setTableItems}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditChartPopup(false)} sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" className="btn-pill-primary" onClick={handleSaveChartData}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
