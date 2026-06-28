%% =====================================================
% TAPI GAS PIPELINE ANALYSIS
% Fluid Mechanics-II Semester Project
% Pressure Distribution, HGL and EGL
%% =====================================================

clc;
clear;
close all;

%% -----------------------------------------------------
% SECTION 1: PIPELINE DATA
%% -----------------------------------------------------

City = {
'Galkynysh', 'Serhetabat','Herat', 'Farah','Kandahar','Chaman','Quetta', 'Multan','Fazilka'};

%% Distance from starting point (km)

Distance = [0 192 412 612 612 852 852 987 1184 1817];

%% Elevation (m)

Elevation = [225 747 920 650 1016 1329 1680 168 182];

%% -----------------------------------------------------
% SECTION 2: LOSSES FROM EXCEL SHEET
%% -----------------------------------------------------

%% Total Loss

TotalLoss = MajorLoss + MinorLoss;

%% -----------------------------------------------------
% SECTION 3: PRESSURE CALCULATION
%% -----------------------------------------------------

OutletPressure = 15;      % bar

n = length(City);

Pressure = zeros(1,n);

Pressure(n) = OutletPressure;

for i = n-1:-1:1

    PressureDrop = TotalLoss(i)/1e5;

    Pressure(i) = Pressure(i+1) + PressureDrop;

end

%% -----------------------------------------------------
% SECTION 4: HYDRAULIC GRADE LINE (HGL)
%% -----------------------------------------------------

Gamma = [6.80814 6.87681 6.85719 6.86400 ...
         6.87681 6.62175 7.00434 7.03377 ...
         6.92586 6.92586 7.00434 7.08282 ...
         6.96510 6.87191 6.84738 6.87191 ...
         6.87191 6.82386 6.83563 6.89643 ...
         6.92586 6.86210 6.97297 6.90134 ...
         6.70317 6.69140 6.70317 6.71495 ...
         6.72770 6.70317 6.70317 6.68650 ...
         6.70317 6.70317 6.76890];

HGL = (Pressure.*1e5)./Gamma + Elevation;

%% -----------------------------------------------------
% SECTION 5: ENERGY GRADE LINE (EGL)
%% -----------------------------------------------------
% Option A:
% Velocity head calculated directly from
% TAPI capacity (33 BCM/year) and 56-inch diameter

Q = 33e9/(365*24*3600);      % m^3/s

D = 56*0.0254;              % m

A = pi*D^2/4;               % m^2

V = Q/A;                    % m/s

VelocityHead = V^2/(2*9.81);

EGL = HGL + VelocityHead;

%% -----------------------------------------------------
% SECTION 6: RESULTS TABLE
%% -----------------------------------------------------

Results = table( ...
    City', ...
    Distance', ...
    Elevation', ...
    MajorLoss', ...
    MinorLoss', ...
    Pressure', ...
    HGL', ...
    EGL', ...
    'VariableNames', ...
    {'City','Distance_km','Elevation_m',...
     'MajorLoss','MinorLoss',...
     'Pressure_bar','HGL_m','EGL_m'});

disp(Results)

%% -----------------------------------------------------
% SECTION 7: PRESSURE PROFILE
%% -----------------------------------------------------

figure

plot(Distance,Pressure,'-o','LineWidth',2)

grid on

xlabel('Distance (km)')
ylabel('Pressure (bar)')

title('Pressure Distribution Along TAPI Pipeline')

%% -----------------------------------------------------
% SECTION 8: HGL & EGL
%% -----------------------------------------------------

figure

plot(Distance,HGL,'LineWidth',2)

hold on

plot(Distance,EGL,'LineWidth',2)

grid on

xlabel('Distance (km)')
ylabel('Head (m)')

title('Hydraulic Grade Line (HGL) and Energy Grade Line (EGL)')

legend('HGL','EGL','Location','best')

%% -----------------------------------------------------
% SECTION 9: FINAL OUTPUTS
%% -----------------------------------------------------

fprintf('\n');
fprintf('=====================================\n');
fprintf('TAPI PIPELINE ANALYSIS RESULTS\n');
fprintf('=====================================\n');

fprintf('Flow Rate          = %.2f m^3/s\n',Q);
fprintf('Pipe Diameter      = %.4f m\n',D);
fprintf('Pipe Area          = %.4f m^2\n',A);
fprintf('Flow Velocity      = %.2f m/s\n',V);
fprintf('Velocity Head      = %.2f m\n',VelocityHead);

fprintf('\n');

fprintf('Total Major Loss   = %.3e\n',sum(MajorLoss));
fprintf('Total Minor Loss   = %.3e\n',sum(MinorLoss));
fprintf('Total Loss         = %.3e\n',sum(TotalLoss));

fprintf('\n');

fprintf('Inlet Pressure     = %.2f bar\n',Pressure(1));
fprintf('Outlet Pressure    = %.2f bar\n',Pressure(end));

fprintf('=====================================\n');
