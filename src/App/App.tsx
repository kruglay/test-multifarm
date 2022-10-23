import React, {useEffect, useState} from 'react';
import {Area, CartesianGrid, Label, Tooltip, XAxis, YAxis} from 'recharts';
import {DateTime} from 'luxon';

import {
	AreaChartStyled,
	CircularProgressStyled,
	Container,
	Header,
	ToggleButtonGroupStyled,
	ToggleButtonStyled
} from './styles';

interface IChartValue {
	date: number;
	value: number;
}

interface IData {
	chartValues: [IChartValue];
	startDate: number;
	endDate: number;
}

interface IInfo {
	farm: string;
	asset: string;
}

interface IPrepeared {
	info: IInfo;
	data: IData;
}


const prepareData = (json: any): IPrepeared => {
	const result = {} as IPrepeared;
	result.info = {farm: json.farm, asset: json.asset};

	const chartValues = json.tvlStakedHistory
		.sort((a: { date: string; }, b: { date: string; }) => (DateTime.fromISO(a.date).toUnixInteger() - DateTime.fromISO(b.date).toUnixInteger()))
		.map((el: { date: string, value: number }) => ({
			value: el.value,
			date: DateTime.fromISO(el.date).toUnixInteger()
		}));
	result.data = {
		chartValues,
		startDate: chartValues[0].date,
		endDate: chartValues[chartValues.length - 1].date,
	};

	return result;
}

const getTicks = ({startDate, endDate, period}: { startDate: number, endDate?: number, period?: number }): number[] => {
	let days = period;
	if (endDate) {
		const diff = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), 'days');
		days = diff.days + 1;
	}
	const ticks = Array.from(Array(days), (el, i) => (startDate + i * 86400)); //86400 seconds in a day

	return ticks;
}

const valueFormatter = (value: number) => Intl.NumberFormat('en-US', {
	notation: 'compact',
	compactDisplay: 'short',
	maximumFractionDigits: 2,
}).format(value);

const dateFormatter = (date: number) => DateTime.fromSeconds(date).toFormat('dd.MM')

export function App() {
	const [loading, setLoading] = useState(false);
	const [chartInfo, setChartInfo] = useState<IInfo | null>(null);
	const [data, setData] = useState<IData | null>(null);
	const [period, setPeriod] = useState<number>(7)


	useEffect(() => {
		const func = async () => {
			try {
				setLoading(true);
				const resp = await fetch('https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_asset_details/ETH_Convex_steth');
				const json = await resp.json();
				const prepeared = prepareData(json);
				setChartInfo(prepeared.info);
				setData(prepeared.data);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		}

		func();
	}, []);

	return (
		<Container>
			<Header>
				{chartInfo?.farm && <>
					<span>{chartInfo?.farm}</span>: {chartInfo?.asset}
				</>}
			</Header>
			<ToggleButtonGroupStyled
				value={period}
				exclusive
				onChange={(e, value) => setPeriod(value)}
			>
				<ToggleButtonStyled value={7}>
					7d
				</ToggleButtonStyled>
				<ToggleButtonStyled value={14}>
					14d
				</ToggleButtonStyled>
				<ToggleButtonStyled value={30}>
					30d
				</ToggleButtonStyled>
				<ToggleButtonStyled value={90}>
					90d
				</ToggleButtonStyled>
			</ToggleButtonGroupStyled>
			{loading && <CircularProgressStyled size={80}/>}
			<AreaChartStyled
				width={1080}
				height={590}
				data={data?.chartValues}
				margin={{top: 100, right: 30, left: 30, bottom: 30}}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8900B4" stopOpacity={0}/>
						<stop offset="95%" stopColor="#8900B4" stopOpacity={0.6}/>
					</linearGradient>
				</defs>
				{data?.chartValues && <>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
							if (typeof (value) === 'number') {
								return dateFormatter(value)
							}
							return value;
						}}
            tick={{dy: 20}}
            tickLine={false}
            ticks={getTicks({startDate: data?.startDate, period})}
            stroke="#6F6CA4"
            fontWeight={700}
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            dataKey="value"
            tickFormatter={valueFormatter}
            domain={['dataMin', 'auto']}
            tickLine={false}
            stroke="#6F6CA4"
            fontWeight={700}
          >
            <Label
              position="top"
              offset={40}
              dx={20}
              fill="#FFFFFF"
              fontSize="24px"
              fontWeight={700}
            >
              Asset TVL
            </Label>
          </YAxis>
          <CartesianGrid stroke="#6F6CA4"/>
          <Tooltip formatter={(value) => valueFormatter(Number(value))}
                   labelFormatter={(label) => dateFormatter(label)}/>
          <Area type="monotone" dataKey="value" stroke="#8900B4" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3}/>
        </>
				}
			</AreaChartStyled>
		</Container>
	);
}

