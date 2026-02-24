/**
 * Стилевые константы для повторяющихся UI-паттернов.
 * Использовать вместо захардкоженных классов при повторе 2+ раз.
 */

/** Классы бейджа статуса соревнования «Уже идёт» (успех/активен) */
export const BADGE_STATUS_ONGOING =
  "bg-success/10 text-success focus-visible:ring-success/20 dark:bg-success/10 dark:text-success dark:focus-visible:ring-success/40 [a&]:hover:bg-success/5 dark:[a&]:hover:bg-success/5";

/** Классы бейджа статуса соревнования «Запланирован» */
export const BADGE_STATUS_PLANNED =
  "bg-primary/10 text-primary focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 [a&]:hover:bg-primary/5";

/** Классы бейджа статуса соревнования «Завершено» */
export const BADGE_STATUS_COMPLETED =
  "rounded-md bg-secondary text-secondary-foreground border-0";

/** Класс триггера селекта «Строк на странице» (минимальная ширина) */
export const SELECT_PAGE_SIZE_TRIGGER_CLASS = "min-w-[var(--width-select-page-size)]";

/** Базовые классы бейджа статуса (без цвета) */
export const BADGE_STATUS_BASE = "rounded-sm border-none focus-visible:outline-none";

/** Высота строки таблицы по умолчанию (56px) — заголовок и ячейки */
export const TABLE_ROW_HEIGHT_CLASS = "h-[var(--height-table-row)]";

/** Бейдж статуса заявки «На рассмотрении» — оранжевый /10, паттерн как у BADGE_STATUS_ONGOING */
export const BADGE_APPLICATION_UNDER_REVIEW =
  "rounded-md border-0 bg-warning/10 text-warning focus-visible:ring-warning/20 [a&]:hover:bg-warning/5";

/** Бейдж статуса заявки «Проверка документов» — светло-фиолетовый /10 */
export const BADGE_APPLICATION_DOCUMENT_CHECK =
  "rounded-md border-0 bg-primary/10 text-primary focus-visible:ring-primary/20 [a&]:hover:bg-primary/5";

/** Бейдж статуса заявки «Найдены ошибки» — светло-красный /10 */
export const BADGE_APPLICATION_ERRORS_FOUND =
  "rounded-md border-0 bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/5";

/** Бейдж статуса заявки «Отклонена» — красный /10, аналогично «Найдены ошибки» */
export const BADGE_APPLICATION_REJECTED =
  "rounded-md border-0 bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/5";

/** Бейдж статуса заявки «Принята» — зелёный /10 */
export const BADGE_APPLICATION_ACCEPTED =
  "rounded-md border-0 bg-success/10 text-success focus-visible:ring-success/20 [a&]:hover:bg-success/5";

/** Бейдж статуса документа «Подписан» — зелёный /10 */
export const BADGE_DOCUMENT_SIGNED =
  "rounded-md border-0 bg-success/10 text-success focus-visible:ring-success/20 [a&]:hover:bg-success/5";

/** Бейдж статуса документа «Не подписан» — фиолетовый /10 */
export const BADGE_DOCUMENT_UNSIGNED =
  "rounded-md border-0 bg-primary/10 text-primary focus-visible:ring-primary/20 [a&]:hover:bg-primary/5";

/** Бейдж статуса пользователя «Активный» — зелёный /10, аналогично «Подписан» */
export const BADGE_USER_ACTIVE =
  "rounded-md border-0 bg-success/10 text-success focus-visible:ring-success/20 [a&]:hover:bg-success/5";
