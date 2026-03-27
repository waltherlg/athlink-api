import { Controller } from '@nestjs/common';
import { dashboardPaths } from '@shared-types';

@Controller(dashboardPaths.controller)
export class DashboardController {}
