import fs from 'fs';
import path from 'path';
import { CmsStore } from '../src/types.js';
import { initialCmsData } from '../src/data/initialData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms-store.json');

class DatabaseService {
  private store: CmsStore;

  constructor() {
    this.store = this.loadData();
  }

  private loadData(): CmsStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as CmsStore;
        // Merge with initial data to ensure new fields are preserved
        return {
          ...initialCmsData,
          ...parsed,
          destinations: (parsed.destinations || initialCmsData.destinations).map((d) => {
            const initD = initialCmsData.destinations.find((id) => id.id === d.id);
            return {
              ...initD,
              ...d,
              state: d.state || initD?.state || 'Uttar Pradesh',
              whyStayReasons: d.whyStayReasons && d.whyStayReasons.length ? d.whyStayReasons : (initD?.whyStayReasons || d.highlights || []),
            };
          }),
          attractions: parsed.attractions?.length ? parsed.attractions : initialCmsData.attractions,
          emailLogs: parsed.emailLogs || parsed.notifications?.emailLogs || initialCmsData.notifications?.emailLogs || [],
          contact: { ...initialCmsData.contact, ...(parsed.contact || {}) },
          policies: { ...initialCmsData.policies, ...(parsed.policies || {}) },
          notifications: {
            ...initialCmsData.notifications,
            ...(parsed.notifications || {}),
            emailLogs: parsed.notifications?.emailLogs || parsed.emailLogs || [],
          },
          seo: { ...initialCmsData.seo, ...(parsed.seo || {}) },
          siteSettings: { ...initialCmsData.siteSettings, ...(parsed.siteSettings || {}) },
        };
      } else {
        this.saveData(initialCmsData);
        return JSON.parse(JSON.stringify(initialCmsData));
      }
    } catch (err) {
      console.error('Error loading CMS data, using initial data fallback:', err);
      return JSON.parse(JSON.stringify(initialCmsData));
    }
  }

  private saveData(data: CmsStore): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to CMS database file:', err);
    }
  }

  public getStore(): CmsStore {
    return this.store;
  }

  public updateStore(updater: (current: CmsStore) => CmsStore): CmsStore {
    this.store = updater(this.store);
    this.saveData(this.store);
    return this.store;
  }

  public resetToDefault(): CmsStore {
    this.store = JSON.parse(JSON.stringify(initialCmsData));
    this.saveData(this.store);
    return this.store;
  }
}

export const db = new DatabaseService();
