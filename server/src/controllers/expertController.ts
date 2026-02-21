import { Request, Response } from 'express';
import Expert from '../models/Expert';

// Safe integer parser — guards against NaN from ?page=abc&limit=xyz
const safeInt = (val: string | undefined, fallback: number, max?: number): number => {
  const n = parseInt(val ?? '', 10);
  const result = Number.isNaN(n) || n < 1 ? fallback : n;
  return max !== undefined ? Math.min(result, max) : result;
};

// GET /experts  — paginated + filtered
export const getExperts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, category, search } = req.query as Record<string, string | undefined>;

    const query: Record<string, unknown> = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = safeInt(page, 1);
    const limitNum = safeInt(limit, 8, 50); // max 50 per page
    const skip = (pageNum - 1) * limitNum;

    const [experts, total] = await Promise.all([
      Expert.find(query)
        .select('name category experience rating bio avatar')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Expert.countDocuments(query),
    ]);

    res.json({
      experts,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// GET /experts/:id
export const getExpertById = async (req: Request, res: Response): Promise<void> => {
  // Validate ObjectId format before hitting MongoDB — returns clean 400 vs CastError 500
  const expertId = String(req.params.id);
  if (!/^[a-f\d]{24}$/i.test(expertId)) {
    res.status(400).json({ message: 'Invalid expert ID format' });
    return;
  }

  try {
    const expert = await Expert.findById(expertId).lean();
    if (!expert) {
      res.status(404).json({ message: 'Expert not found' });
      return;
    }
    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
