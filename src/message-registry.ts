import {MAVLinkMessage} from './mavlink-message';
import {Heartbeat} from './messages/heartbeat';
import {SysStatus} from './messages/sys-status';
import {SystemTime} from './messages/system-time';
import {Ping} from './messages/ping';
import {ChangeOperatorControl} from './messages/change-operator-control';
import {ChangeOperatorControlAck} from './messages/change-operator-control-ack';
import {AuthKey} from './messages/auth-key';
import {SetMode} from './messages/set-mode';
import {ParamRequestRead} from './messages/param-request-read';
import {ParamRequestList} from './messages/param-request-list';
import {ParamValue} from './messages/param-value';
import {ParamSet} from './messages/param-set';
import {GpsRawInt} from './messages/gps-raw-int';
import {GpsStatus} from './messages/gps-status';
import {ScaledImu} from './messages/scaled-imu';
import {RawImu} from './messages/raw-imu';
import {RawPressure} from './messages/raw-pressure';
import {ScaledPressure} from './messages/scaled-pressure';
import {Attitude} from './messages/attitude';
import {AttitudeQuaternion} from './messages/attitude-quaternion';
import {LocalPositionNed} from './messages/local-position-ned';
import {GlobalPositionInt} from './messages/global-position-int';
import {RcChannelsScaled} from './messages/rc-channels-scaled';
import {RcChannelsRaw} from './messages/rc-channels-raw';
import {ServoOutputRaw} from './messages/servo-output-raw';
import {MissionRequestPartialList} from './messages/mission-request-partial-list';
import {MissionWritePartialList} from './messages/mission-write-partial-list';
import {MissionItem} from './messages/mission-item';
import {MissionRequest} from './messages/mission-request';
import {MissionSetCurrent} from './messages/mission-set-current';
import {MissionCurrent} from './messages/mission-current';
import {MissionRequestList} from './messages/mission-request-list';
import {MissionCount} from './messages/mission-count';
import {MissionClearAll} from './messages/mission-clear-all';
import {MissionItemReached} from './messages/mission-item-reached';
import {MissionAck} from './messages/mission-ack';
import {SetGpsGlobalOrigin} from './messages/set-gps-global-origin';
import {GpsGlobalOrigin} from './messages/gps-global-origin';
import {ParamMapRc} from './messages/param-map-rc';
import {MissionRequestInt} from './messages/mission-request-int';
import {SafetySetAllowedArea} from './messages/safety-set-allowed-area';
import {SafetyAllowedArea} from './messages/safety-allowed-area';
import {AttitudeQuaternionCov} from './messages/attitude-quaternion-cov';
import {NavControllerOutput} from './messages/nav-controller-output';
import {GlobalPositionIntCov} from './messages/global-position-int-cov';
import {LocalPositionNedCov} from './messages/local-position-ned-cov';
import {RcChannels} from './messages/rc-channels';
import {RequestDataStream} from './messages/request-data-stream';
import {DataStream} from './messages/data-stream';
import {ManualControl} from './messages/manual-control';
import {RcChannelsOverride} from './messages/rc-channels-override';
import {MissionItemInt} from './messages/mission-item-int';
import {VfrHud} from './messages/vfr-hud';
import {CommandInt} from './messages/command-int';
import {CommandLong} from './messages/command-long';
import {CommandAck} from './messages/command-ack';
import {ManualSetpoint} from './messages/manual-setpoint';
import {SetAttitudeTarget} from './messages/set-attitude-target';
import {AttitudeTarget} from './messages/attitude-target';
import {SetPositionTargetLocalNed} from './messages/set-position-target-local-ned';
import {PositionTargetLocalNed} from './messages/position-target-local-ned';
import {SetPositionTargetGlobalInt} from './messages/set-position-target-global-int';
import {PositionTargetGlobalInt} from './messages/position-target-global-int';
import {LocalPositionNedSystemGlobalOffset} from './messages/local-position-ned-system-global-offset';
import {HilState} from './messages/hil-state';
import {HilControls} from './messages/hil-controls';
import {HilRcInputsRaw} from './messages/hil-rc-inputs-raw';
import {HilActuatorControls} from './messages/hil-actuator-controls';
import {OpticalFlow} from './messages/optical-flow';
import {GlobalVisionPositionEstimate} from './messages/global-vision-position-estimate';
import {VisionPositionEstimate} from './messages/vision-position-estimate';
import {VisionSpeedEstimate} from './messages/vision-speed-estimate';
import {ViconPositionEstimate} from './messages/vicon-position-estimate';
import {HighresImu} from './messages/highres-imu';
import {OpticalFlowRad} from './messages/optical-flow-rad';
import {HilSensor} from './messages/hil-sensor';
import {SimState} from './messages/sim-state';
import {RadioStatus} from './messages/radio-status';
import {FileTransferProtocol} from './messages/file-transfer-protocol';
import {Timesync} from './messages/timesync';
import {CameraTrigger} from './messages/camera-trigger';
import {HilGps} from './messages/hil-gps';
import {HilOpticalFlow} from './messages/hil-optical-flow';
import {HilStateQuaternion} from './messages/hil-state-quaternion';
import {ScaledImu2} from './messages/scaled-imu2';
import {LogRequestList} from './messages/log-request-list';
import {LogEntry} from './messages/log-entry';
import {LogRequestData} from './messages/log-request-data';
import {LogData} from './messages/log-data';
import {LogErase} from './messages/log-erase';
import {LogRequestEnd} from './messages/log-request-end';
import {GpsInjectData} from './messages/gps-inject-data';
import {Gps2Raw} from './messages/gps2-raw';
import {PowerStatus} from './messages/power-status';
import {SerialControl} from './messages/serial-control';
import {GpsRtk} from './messages/gps-rtk';
import {Gps2Rtk} from './messages/gps2-rtk';
import {ScaledImu3} from './messages/scaled-imu3';
import {DataTransmissionHandshake} from './messages/data-transmission-handshake';
import {EncapsulatedData} from './messages/encapsulated-data';
import {DistanceSensor} from './messages/distance-sensor';
import {TerrainRequest} from './messages/terrain-request';
import {TerrainData} from './messages/terrain-data';
import {TerrainCheck} from './messages/terrain-check';
import {TerrainReport} from './messages/terrain-report';
import {ScaledPressure2} from './messages/scaled-pressure2';
import {AttPosMocap} from './messages/att-pos-mocap';
import {SetActuatorControlTarget} from './messages/set-actuator-control-target';
import {ActuatorControlTarget} from './messages/actuator-control-target';
import {Altitude} from './messages/altitude';
import {ResourceRequest} from './messages/resource-request';
import {ScaledPressure3} from './messages/scaled-pressure3';
import {FollowTarget} from './messages/follow-target';
import {ControlSystemState} from './messages/control-system-state';
import {BatteryStatus} from './messages/battery-status';
import {AutopilotVersion} from './messages/autopilot-version';
import {LandingTarget} from './messages/landing-target';
import {EstimatorStatus} from './messages/estimator-status';
import {WindCov} from './messages/wind-cov';
import {GpsInput} from './messages/gps-input';
import {GpsRtcmData} from './messages/gps-rtcm-data';
import {HighLatency} from './messages/high-latency';
import {HighLatency2} from './messages/high-latency2';
import {Vibration} from './messages/vibration';
import {HomePosition} from './messages/home-position';
import {SetHomePosition} from './messages/set-home-position';
import {MessageInterval} from './messages/message-interval';
import {ExtendedSysState} from './messages/extended-sys-state';
import {AdsbVehicle} from './messages/adsb-vehicle';
import {Collision} from './messages/collision';
import {V2Extension} from './messages/v2-extension';
import {MemoryVect} from './messages/memory-vect';
import {DebugVect} from './messages/debug-vect';
import {NamedValueFloat} from './messages/named-value-float';
import {NamedValueInt} from './messages/named-value-int';
import {Statustext} from './messages/statustext';
import {Debug} from './messages/debug';
export const messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]> = [
	[0, Heartbeat],
	[1, SysStatus],
	[2, SystemTime],
	[4, Ping],
	[5, ChangeOperatorControl],
	[6, ChangeOperatorControlAck],
	[7, AuthKey],
	[11, SetMode],
	[20, ParamRequestRead],
	[21, ParamRequestList],
	[22, ParamValue],
	[23, ParamSet],
	[24, GpsRawInt],
	[25, GpsStatus],
	[26, ScaledImu],
	[27, RawImu],
	[28, RawPressure],
	[29, ScaledPressure],
	[30, Attitude],
	[31, AttitudeQuaternion],
	[32, LocalPositionNed],
	[33, GlobalPositionInt],
	[34, RcChannelsScaled],
	[35, RcChannelsRaw],
	[36, ServoOutputRaw],
	[37, MissionRequestPartialList],
	[38, MissionWritePartialList],
	[39, MissionItem],
	[40, MissionRequest],
	[41, MissionSetCurrent],
	[42, MissionCurrent],
	[43, MissionRequestList],
	[44, MissionCount],
	[45, MissionClearAll],
	[46, MissionItemReached],
	[47, MissionAck],
	[48, SetGpsGlobalOrigin],
	[49, GpsGlobalOrigin],
	[50, ParamMapRc],
	[51, MissionRequestInt],
	[54, SafetySetAllowedArea],
	[55, SafetyAllowedArea],
	[61, AttitudeQuaternionCov],
	[62, NavControllerOutput],
	[63, GlobalPositionIntCov],
	[64, LocalPositionNedCov],
	[65, RcChannels],
	[66, RequestDataStream],
	[67, DataStream],
	[69, ManualControl],
	[70, RcChannelsOverride],
	[73, MissionItemInt],
	[74, VfrHud],
	[75, CommandInt],
	[76, CommandLong],
	[77, CommandAck],
	[81, ManualSetpoint],
	[82, SetAttitudeTarget],
	[83, AttitudeTarget],
	[84, SetPositionTargetLocalNed],
	[85, PositionTargetLocalNed],
	[86, SetPositionTargetGlobalInt],
	[87, PositionTargetGlobalInt],
	[89, LocalPositionNedSystemGlobalOffset],
	[90, HilState],
	[91, HilControls],
	[92, HilRcInputsRaw],
	[93, HilActuatorControls],
	[100, OpticalFlow],
	[101, GlobalVisionPositionEstimate],
	[102, VisionPositionEstimate],
	[103, VisionSpeedEstimate],
	[104, ViconPositionEstimate],
	[105, HighresImu],
	[106, OpticalFlowRad],
	[107, HilSensor],
	[108, SimState],
	[109, RadioStatus],
	[110, FileTransferProtocol],
	[111, Timesync],
	[112, CameraTrigger],
	[113, HilGps],
	[114, HilOpticalFlow],
	[115, HilStateQuaternion],
	[116, ScaledImu2],
	[117, LogRequestList],
	[118, LogEntry],
	[119, LogRequestData],
	[120, LogData],
	[121, LogErase],
	[122, LogRequestEnd],
	[123, GpsInjectData],
	[124, Gps2Raw],
	[125, PowerStatus],
	[126, SerialControl],
	[127, GpsRtk],
	[128, Gps2Rtk],
	[129, ScaledImu3],
	[130, DataTransmissionHandshake],
	[131, EncapsulatedData],
	[132, DistanceSensor],
	[133, TerrainRequest],
	[134, TerrainData],
	[135, TerrainCheck],
	[136, TerrainReport],
	[137, ScaledPressure2],
	[138, AttPosMocap],
	[139, SetActuatorControlTarget],
	[140, ActuatorControlTarget],
	[141, Altitude],
	[142, ResourceRequest],
	[143, ScaledPressure3],
	[144, FollowTarget],
	[146, ControlSystemState],
	[147, BatteryStatus],
	[148, AutopilotVersion],
	[149, LandingTarget],
	[230, EstimatorStatus],
	[231, WindCov],
	[232, GpsInput],
	[233, GpsRtcmData],
	[234, HighLatency],
	[235, HighLatency2],
	[241, Vibration],
	[242, HomePosition],
	[243, SetHomePosition],
	[244, MessageInterval],
	[245, ExtendedSysState],
	[246, AdsbVehicle],
	[247, Collision],
	[248, V2Extension],
	[249, MemoryVect],
	[250, DebugVect],
	[251, NamedValueFloat],
	[252, NamedValueInt],
	[253, Statustext],
	[254, Debug],
];