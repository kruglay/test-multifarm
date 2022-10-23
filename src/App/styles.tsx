import styled from '@emotion/styled';
import {AreaChart} from 'recharts';
import {CircularProgress, ToggleButton, ToggleButtonGroup} from '@mui/material';

export const Container = styled.section({
	label: 'Container',
	display: 'flex',
	flexDirection: 'column',
	width: 1080,
	alignItems: 'center',
	margin: 'auto',
	backgroundColor: '#272D49',
	position: 'relative',
	marginTop: '96px',
});

export const Header = styled.div({
	width: '100%',
	fontSize: '36px',
	color: '#FFFFFF',
	'& span': {
		color: '#627EFF',
		fontWeight: 700,
	},
	marginBottom: '24px',
	flexBasis: '42px'
})

export const AreaChartStyled = styled(AreaChart)({
	label: 'AreaChartStyled',
	backgroundColor: '#2E3456',
	borderRadius: '16px 16px 0px 0px',
	'& .recharts-xAxis.xAxis .recharts-cartesian-axis-ticks .recharts-layer.recharts-cartesian-axis-tick:last-child': {
		transform: 'translateX(-8px)',
	}
})

export const ToggleButtonGroupStyled = styled(ToggleButtonGroup)({
	label: 'ToggleButtonGroupStyled',
	position: 'absolute',
	right: '24px',
	top: '88px',
	zIndex: '1',
	backgroundColor: '#363d6e',
	border: 'none',
	borderRadius: '16px',
});

export const ToggleButtonStyled = styled(ToggleButton)({
	label: 'ToggleButtonStyled',
	border: 'none',
	minWidth: '48px',
	borderRadius: '16px!important',
	color: '#FFFFFF',
	textTransform: 'none',
	'&.Mui-selected': {
		background: 'linear-gradient(to right, #627EFF, #627EFF1A)',
		color: '#FFFFFF'
	}
});

export const CircularProgressStyled = styled(CircularProgress)({
		label: 'CircularProgressStyled',
		position: 'absolute',
		top: '50%',
		zIndex: 1,
	}
);