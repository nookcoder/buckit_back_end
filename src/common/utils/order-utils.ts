import { Project, ProjectStatus } from '../../project/entities/project.entity';

export function generateOrderCode(category: string, quantityQty: number) {
  const categoryCode = generateCategoryCode(category);
  const now = Date.now().toString(16).toUpperCase();
  return categoryCode + quantityQty.toString(16).toUpperCase() + now;
}

function generateCategoryCode(category: string) {
  switch (category) {
    case '주점':
      return 'B';
    case '카페':
      return 'C';
    default:
      return 'A';
  }
}
export function handleErrorOfProject(
  project: Project | undefined,
  quarterQty: number | null
): void | Error {
  if (!project) {
    throw new Error('Not Found This Project');
  } else if (project && project.status !== ProjectStatus.FUNDING_PROGRESS) {
    throw new Error("Can't Funding Now");
  } else if (project.totalQuarter < project.soldQuarter + quarterQty) {
    throw new Error('Not Enough Block');
  } else {
    return;
  }
}
